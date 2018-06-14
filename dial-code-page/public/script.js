(function () {
  var dialcode, tenantId, tenantInfo, orgInfo;
  var hostURL = "https://dev.open-sunbird.org";

  function OnLoad() {
    dialcode = getUrlParameter('dialcode');
    tenantId = getUrlParameter('tenant');
    $('#loader').hide(); // hide loader on page load
    $('#noResultMessage').hide(); // hide no result found message
    if (dialcode) {
      $('#searchSection').hide();
      $('#resultSection').show();
      $('#resultPageHeader').text("Dial Code '" + dialcode + "'");
    } else {
      $('#searchSection').show();
      $('#resultSection').hide();
    }
    getTenantInfo(tenantId);
    getOrgInfo(tenantId).done(function () {
      initTelemetryService();
      logImpressionEvent();
    });
    if (typeof dialcode === "string") searchDialCode(dialcode);
  }

  function getUrlParameter(param) {
    var url = decodeURIComponent(window.location.search.substring(1)),
      urlVar = url.split('&'), paramName, i;
    for (i = 0; i < urlVar.length; i++) {
      paramName = urlVar[i].split('=');
      if (paramName[0] === param) {
        return paramName[1] === undefined ? true : paramName[1];
      }
    }
  };

  // Attach keypress event to search input
  $("#searchInput").keypress(function (event) {
    if (event.which == 13) {
      var dialCode = $("#searchInput").val();
      if (dialCode.length === 6) {
        searchDialCode(dialCode);
        $('#searchSection').hide();
        $('#resultSection').show(); //show result page
        $('#resultPageHeader').text("Dial Code '" + dialCode + "'");
        // log impression event on navigating to result page
        logImpressionEvent();
      }
    }
  });

  // to search dial code
  function searchDialCode(id) {
    $('#loader').show();
    return $.ajax({
      method: "POST",
      url: hostURL + "/content/composite/v1/search",
      data: JSON.stringify({
        "request": {
          "filters": {
            "dialcodes": id
          }
        }
      }),
      contentType: "application/json"
    })
      .done(function (response) {
        $('#loader').hide();
        console.log('composite search response', response);
        if (response && response.responseCode === "OK") {
          response.result.count && response.result.content.forEach(function (data) {
            createCard(data);
          });
        }
      })
      .done(function (response) {
        if (response.result && response.result.count) {
          $('.rating').rating('disable');
          $('#searchCount').text("Linked contents (" + response.result.count + ")");
        } else {
          $('#noResultMessage').show();
        }
      });
  }

  // create search result card
  function createCard(data) {
    var $cardInstance = $("#contentCardTemplate").clone();
    $cardInstance.css('display', '');
    if (data.appIcon) $cardInstance.find('#cardImage').attr('src', data.appIcon);
    if (data.contentType) $cardInstance.find('#cardLabelRight').text(data.contentType);
    if (data.badgeAssertions && data.badgeAssertions.length) {
      var isOfficial = data.badgeAssertions.find(function (data) {
        return data.badgeClassName === "OFFICIAL"
      });
      if (isOfficial) {
        $cardInstance.find('#cardLabelLeft').text('OFFICIAL');
      }
    } else {
      $cardInstance.find('#cardLabelLeft').remove();
    }
    if (data.mimeType === 'application/vnd.ekstep.content-collection') {
      $cardInstance.find('#linkCard').attr('href', hostURL + '/play/collection/' + data.identifier)
    } else {
      $cardInstance.find('#linkCard').attr('href', hostURL + '/play/content/' + data.identifier)
    }
    if (data.name) $cardInstance.find('#cardType').text(data.name);
    if (data.description) $cardInstance.find('#cardContentHeader').text(data.description);
    $("#cardListHolder").append($cardInstance);
  }

  function getTenantInfo(id) {
    var URL = "https://diksha.gov.in/v1/tenant/info";
    if (id) URL += "/" + id;
    return $.ajax({
      method: "GET",
      url: URL
    }).done(function (response) {
      if (response && response.responseCode === "OK") {
        $('#appLogo').attr('src', response.result.appLogo);
        $('#favicon').attr('href', response.result.favicon);
        document.title = response.result.titleName;
        tenantInfo = response.result;
      }
    })
  }

  function getOrgInfo(id) {
    return $.ajax({
      method: "POST",
      url: hostURL + "/content/org/v1/search",
      data: JSON.stringify({
        request: {
          filters: { slug: id || 'ntp' }
        }
      }),
      contentType: "application/json"
    }).done(function (response) {
      if (response && response.responseCode === "OK") {
        orgInfo = response.result.response.content[0];
      }
    })
  };

  function getAnonymousUserConfig() {
    var endpoint = "/data/v1/telemetry"
    return {
      pdata: {
        id: 'prod.diksha.portal',
        ver: '1.7.0',
        pid: 'sunbird-portal'
      },
      endpoint: endpoint,
      apislug: "/content",
      host: hostURL,
      uid: 'anonymous',
      sid: window.uuidv1(),
      channel: orgInfo.channel,
      env: 'dialcode-search-page',
      enableValidation: true
    }
  }

  function initTelemetryService() {
    var config = getAnonymousUserConfig();
    window.EkTelemetry.initialize(config);
  }

  function logImpressionEvent() {
    var options = {
      context: {
        env: 'dialcode-search-page',
        channel: orgInfo.channel,
        uid: 'anonymous',
        cdata: [],
        rollup: getRollupData([orgInfo.rootOrgId])
      },
      object: {
        id: dialcode,
        type: 'dialcode',
        ver: '1.0',
        rollup: {}
      },
      tags: [orgInfo.rootOrgId]
    };
    var edata = {
      type: 'view',
      pageid: 'get',
      subtype: 'paginate',
      uri: window.location.href || "",
      visits: []
    };
    window.EkTelemetry.impression(edata, options);
    window.EkTelemetry.syncEvents();
  }

  function getRollupData(orgIds) {
    var rollup = {};
    orgIds.forEach(function (el, index) {
      rollup['l' + (index + 1)] = el;
    })
    return rollup;
  }

  // On page load
  OnLoad();
})();
