import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
/**
 * This resolver is used to get the initial tenant configuration
 * and then set all the details to the localstorage for the complete
 * application to work. The infotmation fetche by the resolver includes
 * homepage theming styles and content for a particular tenant layout
 */
export class TenantResolverService {
  constructor(private http: HttpClient) { }

  private subOrgConfigurations = [
    {
      'homeUrl': 'camino.stackroute.com',
      'orgid': '0127053482034872320',
      'orgName': 'niit',
      'framework': 'niit_tv',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'https://i.postimg.cc/Qx1jSM83/banner1.jpg',
            'heading': `LET's BOOST YOUR SKILLS`,
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': false,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-utton': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#4a1e75',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': false,
        'Qna': false,
      }
    },
    {
      'homeUrl': 'localhost:3000',
      'orgid': '0127053482034872320',
      'orgName': 'niit',
      'framework': 'niit_tv',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'https://i.postimg.cc/Qx1jSM83/banner1.jpg',
            'heading': `LET's BOOST YOUR SKILLS`,
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': false,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-utton': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#4a1e75',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': false,
        'Qna': false,
      }
    },
    {
      'homeUrl': 'camino.stackroute.com/samsung',
      'orgid': '01276670296884019217',
      'orgName': 'samsung',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
// tslint:disable-next-line: max-line-length
            'imgUrl': 'https://www.mineraltree.com/wp-content/uploads/blog/accounting-tips-ap-automation-cfo-office/virtual-cards-banner.png',
            'heading': `KICKSTART YOUR CAREER`,
            'paragraph': 'With Samsung R&D department, upgrade your skills and achieve new heights',
          },
          'benefits': {
            'required': false,
            'column-size': 4,
            'columns': [
              {
                'heading': '500 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': true,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-utton': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#F53F85',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': true,
        'Qna': true,
      }
    },
    {
      'homeUrl': 'localhost:3000/samsung',
      'orgid': '01276670296884019217',
      'orgName': 'samsung',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
// tslint:disable-next-line: max-line-length
            'imgUrl': 'https://www.mineraltree.com/wp-content/uploads/blog/accounting-tips-ap-automation-cfo-office/virtual-cards-banner.png',
            'heading': `KICKSTART YOUR CAREER`,
            'paragraph': 'With Samsung R&D department, upgrade your skills and achieve new heights',
          },
          'benefits': {
            'required': false,
            'column-size': 4,
            'columns': [
              {
                'heading': '500 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': true,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-utton': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#F53F85',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': true,
        'Qna': true,
      }
    },
    {
      'homeUrl': 'camino.stackroute.com/SBWB',
      'orgid': '0127660156352102402',
      'orgName': 'SBWB',
      'framework': 'NCF',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'http://localhost:3000/brazil/images/Slider-Image.jpg',
            'heading': `WELCOME TO COSTA RICA`,
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': false,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-button': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#CC7B60',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': true,
        'Qna': true,
      }
    },
    {
      'homeUrl': 'localhost:3000/SBWB',
      'orgid': '0127660156352102402',
      'orgName': 'SBWB',
      'framework': 'NCF',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'http://localhost:3000/brazil/images/Slider-Image.jpg',
            'heading': `WELCOME TO COSTA RICA`,
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': false,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-button': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#CC7B60',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': true,
        'Qna': true,
      }
    },
    {
      'homeUrl': 'camino.stackroute.com/wipro',
      'orgid': '01276670259351552016',
      'orgName': 'wipro',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'http://i65.tinypic.com/2cmvx9j.jpg',
            'heading': 'THE BEST MENTORS, CONTENT FOR YOU',
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses1',
                'subheading': 'Explore a variety of fresh topics1',
              },
              {
                'heading': 'Expert Instructors2',
                'subheading': 'Find the right instructor for you2',
              },
              {
                'heading': 'Lifetime Access3',
                'subheading': 'Learn anytime, anywhere3',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': true,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-button': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#8060e7',
            'secondaryColor': 'green',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': false,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS1',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK1',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT1',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': false,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': false,
        'Qna': false,
      }
    },
    {
      'homeUrl': 'localhost:3000/wipro',
      'orgid': '01276670259351552016',
      'orgName': 'wipro',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'http://i65.tinypic.com/2cmvx9j.jpg',
            'heading': 'THE BEST MENTORS, CONTENT FOR YOU',
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses1',
                'subheading': 'Explore a variety of fresh topics1',
              },
              {
                'heading': 'Expert Instructors2',
                'subheading': 'Find the right instructor for you2',
              },
              {
                'heading': 'Lifetime Access3',
                'subheading': 'Learn anytime, anywhere3',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': true,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-button': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#8060e7',
            'secondaryColor': 'green',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': false,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS1',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK1',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT1',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': false,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': false,
        'Qna': false,
      }
    }
  ];

  public getMockTenant(): Observable<any> {
// tslint:disable-next-line: max-line-length
    const worngUrlResponse = (<HTMLInputElement>document.getElementById('wrongUrl')) ? (<HTMLInputElement>document.getElementById('wrongUrl')).value : false;
    if ( worngUrlResponse === 'true' ) {
      localStorage.removeItem('tenant');
    }
    const localStorageTenant = localStorage.getItem('tenant');
    const tenantUrl = localStorageTenant ? window.location.host + '/'
    + localStorageTenant : (<HTMLInputElement>document.getElementById('tenantUrl')).value;
    // remove the tenant varible as it is no longer needed
    localStorage.removeItem('tenant');
    return of(this.getSubOrgConfig(tenantUrl));
  }

  public getMockDataonID(orgID: string): Observable<object> {
    let found = false;
    let thenanTTheme;
    this.subOrgConfigurations.forEach(tenant => {
      if (found === false && tenant['orgid'] === orgID) {
        console.log('found new config from orgID', tenant);
        found = true;
        thenanTTheme = tenant;
        // update the tenantName in localStorage
      localStorage.setItem('tenant', thenanTTheme['orgName']);
      }
    });
    if (found === false) {
      thenanTTheme = null;
    }
    return of(thenanTTheme);
  }


  private searchSubOrg(value: string) {
    if (value && value.length > 0) {
      // find out the theme
      let found = false;
      let tenanTTheme;
      this.subOrgConfigurations.forEach(tenant => {
        if (found === false && tenant['homeUrl'].indexOf(value) > -1) {
          console.log('found somethin with ', tenant);
          found = true;
          tenanTTheme = tenant;
        }
      });
      if (found === false) {
        tenanTTheme = null;
      }
      return tenanTTheme;
    } else {
      return null;
    }
  }

  private getSubOrgConfig(tenantUrl: string): Observable<any> {
    const tenant = tenantUrl.split('/')[1];

    const subOrgTenantTheme = this.searchSubOrg(tenant);
    if (subOrgTenantTheme !== undefined && subOrgTenantTheme !== null) {
      return of(subOrgTenantTheme);
    } else {
      // sending the theme of main domain
      return of(this.searchSubOrg(tenantUrl.split('/')[0]));
    }
  }
}


/**
 * {
      'homeUrl': 'localhost:3000/niit',
      'orgid': '0127589565338337284',
      'framework': 'NCF',
      'orgName': '',
      'tenantPreferenceDetails': {
        'Home': {
          'banner': {
            'required': true,
            'imgUrl': 'https://i.postimg.cc/Qx1jSM83/banner1.jpg',
            'heading': `LET's BOOST YOUR SKILLS`,
            'paragraph': 'Learn something new everyday from over 100,000 courses and get inspired by the diversity of online learning.',
          },
          'benefits': {
            'required': true,
            'column-size': 4,
            'columns': [
              {
                'heading': '1000 online courses',
                'subheading': 'Explore a variety of fresh topics',
              },
              {
                'heading': 'Expert Instructors',
                'subheading': 'Find the right instructor for you',
              },
              {
                'heading': 'Lifetime Access',
                'subheading': 'Learn anytime, anywhere',
              },
            ],
          },
          'popularCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'exploreCatCode': {
            'required': true,
            'code': [
              'gradeLevel'
            ],
          },
          'cards': {
            'rating': true,
            'total-reviews': true,
            'image': true,
            'title': true,
            'subtitle': true,
            'orgname': true,
            'tag': true,
            'card-utton': true,
            'progress-bar': {
              'required': true,
              'bar-color': '#fff',
            },
          },
          'theme': {
            'primaryColor': '#4a1e75',
            'secondaryColor': '#D84CAD',
            'accentColor': 'black',
          },
          'testimonial': {
            'required': true,
            'apiUrl': 'url to get the testimonial data',
            'headers': {
              'required': true,
              'value': [
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
                {
                  'key': 'value'
                },
              ],
            },
          },
          'footer': {
            'Column2': [
              {
                'name': 'USEFULL LINKS',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column3': [
              {
                'name': 'LINK',
                'internal': 'boolean',
                'externalUrl': 'string',
              }
            ],
            'column4': {
              'name': 'CONTACT',
              'email': 'info@niit.com',
              'phone': [
                '0124-758252'
              ],
              'address': '122001',
            },
          },
          'Social': {
            'required': true,
            'instagram': {
              'required': true,
              'url': 'url to instagram account',
            },
            'facebook': {
              'required': true,
              'url': 'url to facebook account',
            },
            'twitter': {
              'required': true,
              'url': 'url to twitter account',
            },
            'linkedin': {
              'required': true,
              'url': 'url to linkedin account',
            },
          },
        },
        'discussionForum': true,
        'Qna': true,
      }
    },
 */
