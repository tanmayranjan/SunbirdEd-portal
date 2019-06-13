const _ = require('lodash');
const jwt = require('jsonwebtoken')
const {verifySignature, verifyToken, fetchUserWithExternalId, createUser, createSession, updatePhone, updateRoles, sendSsoKafkaMessage} = require('./../helpers/ssoHelper');
const telemetryHelper = require('../helpers/telemetryHelper');
const fs = require('fs');

const successUrl = '/sso/sign-in/success';
const updatePhoneUrl = '/sign-in/sso/update-phone';
const errorUrl = '/sso/sign-in/error';
const logger = require('sb_logger_util_v2')

module.exports = (app) => {

  app.get('/v2/user/session/create', async (req, res) => { // updating api version to 2
    let jwtPayload, userDetails, redirectUrl, errType;
    try {
      errType = 'VERIFY_SIGNATURE';
      await verifySignature(req.query.token);
      jwtPayload = jwt.decode(req.query.token);
      if (!jwtPayload.state_id || !jwtPayload.school_id || !jwtPayload.name || !jwtPayload.sub) {
        errType = 'PAYLOAD_DATA_MISSING';
        throw 'some of the JWT payload is missing';
      }
      req.session.jwtPayload = jwtPayload;
      errType = 'VERIFY_TOKEN';
      verifyToken(jwtPayload);
      errType = 'USER_FETCH_API';
      userDetails = await fetchUserWithExternalId(jwtPayload, req);
      req.session.userDetails = userDetails;
      if(!_.isEmpty(userDetails) && userDetails.phone) {
        redirectUrl = successUrl + getQueryParams({ id: userDetails.userName });
        logger.info({
          msg: 'sso session create v2 api, successfully redirected to success page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            jwtPayload: jwtPayload,
            query: req.query,
            userDetails: userDetails,
            redirectUrl: redirectUrl
          }
        })
      } else {
        redirectUrl = updatePhoneUrl; // verify phone then create user
        logger.info({
          msg: 'sso session create v2 api, successfully redirected to update phone page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            jwtPayload: jwtPayload,
            query: req.query,
            userDetails: userDetails,
            redirectUrl: redirectUrl
          }
        })
      }
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      logger.error({
        msg: 'sso session create v2 api failed',
        error,
        additionalInfo: {
          errorType: errType,
          jwtPayload: jwtPayload,
          query: req.query,
          userDetails: userDetails,
          redirectUrl: redirectUrl
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  });

  app.get('/v1/sso/phone/verified', async (req, res) => {
    let userDetails, jwtPayload, redirectUrl, errType, createUserReq, updatePhoneReq, updateRolesReq;
    jwtPayload = req.session.jwtPayload; // fetch from session
    userDetails = req.session.userDetails; // fetch from session
    try {
      if (_.isEmpty(jwtPayload) || !req.query.phone) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      if(!_.isEmpty(userDetails) && !userDetails.phone) { // existing user without phone
        errType = 'UPDATE_PHONE';
        updatePhoneReq = {
          userId: userDetails.id,
          phone: req.query.phone,
          phoneVerified: true
        }
        await updatePhone(updatePhoneReq, req).catch(handleProfileUpdateError); // api need to be verified
        logger.info({
          msg: 'sso phone updated successfully and redirected to success page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            phone: req.query.phone,
            jwtPayload: jwtPayload,
            createUserReq: createUserReq,
            userDetails: userDetails,
            updatePhoneReq: updatePhoneReq,
            updateRolesReq: updateRolesReq,
            redirectUrl: redirectUrl,
            errType: errType
          }
        })
      } else if (_.isEmpty(userDetails)) { // create user and update roles
        errType = 'CREATE_USER';
        createUserReq = {
          firstName: jwtPayload.name,
          phone: req.query.phone,
          phoneVerified: true,
          channel: jwtPayload.state_id,
          orgExternalId: jwtPayload.school_id,
          externalIds: [{
            id: jwtPayload.sub,
            provider: jwtPayload.state_id,
            idType: jwtPayload.state_id
          }]
        }
        const newUserID = await createUser(createUserReq, req).catch(handleProfileUpdateError);
        await delay();
        logger.info({msg:'sso new user create response', newUserID})
        if (jwtPayload.roles && jwtPayload.roles.length) {
          errType = 'UPDATE_USER_ROLES';
          updateRolesReq = {
            userId: newUserID.result.userId,
            externalId: jwtPayload.school_id,
            provider: jwtPayload.state_id,
            roles: jwtPayload.roles
          }
          await updateRoles(updateRolesReq, req).catch(handleProfileUpdateError);
        }
        errType = 'FETCH_USER_AFTER_CREATE';
        userDetails = await fetchUserWithExternalId(jwtPayload, req); // to get userName
        if(_.isEmpty(userDetails)){
          errType = 'USER_DETAILS_EMPTY';
          throw 'USER_DETAILS_IS_EMPTY';
        }
        logger.info({msg:'sso new user read details', userDetails})
        req.session.userDetails = userDetails;
        logger.info({
          msg: 'sso user creation and role updated successfully and redirected to success page',
          additionalInfo: {
            state_id: jwtPayload.state_id,
            phone:  req.query.phone,
            jwtPayload: jwtPayload,
            userDetails: userDetails,
            createUserReq: createUserReq,
            updatePhoneReq: updatePhoneReq,
            updateRolesReq: updateRolesReq,
            redirectUrl: redirectUrl,
            errType: errType
          }
        })
      }
      redirectUrl = successUrl + getQueryParams({ id: userDetails.userName });
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      logger.error({
        msg: 'sso user creation/phone update failed, redirected to error page',
        error,
        additionalInfo: {
          state_Id: jwtPayload.state_id,
          errType: errType,
          phone: req.query.phone,
          userDetails: userDetails,
          jwtPayload: jwtPayload,
          redirectUrl: redirectUrl,
          createUserReq: createUserReq,
          updatePhoneReq: updatePhoneReq,
          updateRolesReq: updateRolesReq
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get(successUrl, async (req, res) => { // to support mobile sso flow
    sendSsoKafkaMessage(req);
    res.status(200).sendFile('./success_loader.html', {root: __dirname})
  });

  app.get('/v1/sso/success/redirect', async (req, res) => {
    let userDetails, jwtPayload, redirectUrl, errType;
    jwtPayload = req.session.jwtPayload;
    userDetails = req.session.userDetails;
    try {
      if (_.isEmpty(jwtPayload) || _.isEmpty(userDetails)) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      errType = 'CREATE_SESSION';
      await createSession(userDetails.userName, 'portal', req, res);
      redirectUrl = jwtPayload.redirect_url ? jwtPayload.redirect_url : '/resources';
      logger.info({
        msg: 'sso sign-in success callback, session created',
        additionalInfo: {
          state_Id: jwtPayload.state_id,
          query: req.query,
          redirectUrl: redirectUrl,
          errType: errType
        }
      })
    } catch (error) {
      redirectUrl = `${errorUrl}?error_message=` + getErrorMessage(error, errType);
      logger.error({
        msg: 'sso sign-in success callback, create session error',
        error,
        additionalInfo: {
          state_id: jwtPayload.state_id,
          query: req.query,
          jwtPayload: jwtPayload,
          redirectUrl: redirectUrl,
          errType: errType
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.redirect(redirectUrl || errorUrl);
    }
  })

  app.get('/v1/sso/create/session', async (req, res) => { // needs to onboard to kong
    let userName, response, errType;
    try {
      if (!req.query.id) {
        errType = 'MISSING_QUERY_PARAMS';
        throw 'some of the query params are missing';
      }
      userName = req.query.id;
      errType = 'CREATE_SESSION';
      response = await createSession(userName, 'android',req, res);
      logger.info({
        msg: 'sso sign in create session api success',
        additionalInfo: {
          query: req.query,
          response: response
        }
      })
    } catch (error) {
      response = { error: getErrorMessage(error, errType) };
      logger.error({
        msg: 'sso sign in create session api failed',
        error,
        additionalInfo: {
          errType: errType,
          query: req.query
        }
      })
      logErrorEvent(req, errType, error);
    } finally {
      res.json(response);
    }
  })

  app.get(errorUrl, (req, res) => {
    res.status(200).sendFile('./error_loader.html', {root: __dirname })
  })
  app.get('/v1/sso/error/redirect', async (req, res) => {
    const redirect_uri = encodeURIComponent(`https://${req.get('host')}/resources?auth_callback=1`);
    const redirectUrl = `/auth/realms/sunbird/protocol/openid-connect/auth?client_id=portal&redirect_uri=${redirect_uri}&scope=openid&response_type=code&version=2&error_message=` + req.query.error_message;
    res.redirect(redirectUrl); // should go to error page
  })
}
const handleProfileUpdateError = (error) => {
  if (_.get(error, 'error.params')) {
    throw error.error.params;
  } else if (error instanceof Error) {
    throw error.message;
  } else {
    throw 'unhandled exception while getting userDetails';
  }
}
const delay = (duration = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration)
  });
}

const getErrorMessage = (error, errorType) => {
  if(_.get(error, 'params.err') === 'USER_ACCOUNT_BLOCKED') {
    return 'User account is blocked. Please contact admin';
  } else if (['VERIFY_SIGNATURE', 'PAYLOAD_DATA_MISSING', 'VERIFY_TOKEN'].includes(errorType) ) {
    return 'Your account could not be signed in to DIKSHA due to invalid credentials provided. Please try again with valid credentials.';
  } else {
    return 'Your account could not be signed in to DIKSHA due to technical issue. Please try again after some time';
  }
}
const logErrorEvent = (req, type, error) => {
  let stacktrace;
  if(error instanceof Error){
    stacktrace = error.message;
  } else {
    stacktrace = JSON.stringify(error)
    if(stacktrace === '{}'){
      stacktrace = 'STRINGIFY_FAILED'
    }
  }
  const edata = {
    err: 'SSO_SIGN_IN_ERROR',
    type,
    stacktrace
  }
  const context = {
    env: 'SSO_SIGN_IN'
  }
  telemetryHelper.logApiErrorEventV2(req, {edata, context});
}
const getQueryParams = (queryObj) => {
  return '?' + Object.keys(queryObj).filter(key => queryObj[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
    .join('&');
}
