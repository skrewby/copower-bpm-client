import { subDays } from 'date-fns';
import { throttle } from '../config';
import { applyFilters } from '../utils/apply-filters';
import { applyPagination } from '../utils/apply-pagination';
import { applySort } from '../utils/apply-sort';
import { wait } from '../utils/wait';

const now = new Date();

const leads = [
  {
    "id": 1,
    "name": "Brandice Loomes",
    "refID": "EM-903986",
    "phone": "0472 623 254",
    "status": "Win",
    "sales": "Frank Gao",
    "source": "Online",
    "email": "bloomes0@youku.com",
    "address": "0 Hauk Pass",
    "comment": "Aenean fermentum. Donec ut mauris eget massa tempor convallis.",
    "createdDate": subDays(now, 3),
    "updatedDate": subDays(now, 1)
  }, {
    "id": 2,
    "name": "Gherardo Lowrance",
    "refID": "OL-492863",
    "phone": "0461 908 463",
    "status": "Rejected",
    "sales": "Chris Lim",
    "source": "Energy Market",
    "email": "glowrance1@deliciousdays.com",
    "address": "98 Towne Trail",
    "comment": "Mauris ullamcorper purus sit amet nulla.",
    "createdDate": subDays(now, 2),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 3,
    "name": "Lorry Ishak",
    "refID": "SM-835559",
    "phone": "0453 627 181",
    "status": "Rejected",
    "sales": "Fred Trim",
    "source": "Local Champ",
    "email": "lishak2@globo.com",
    "address": "963 Commercial Avenue",
    "comment": "Duis bibendum.",
    "createdDate": subDays(now, 2),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 4,
    "name": "Darrin Tirrey",
    "refID": "EM-871263",
    "phone": "0438 513 445",
    "status": "Closed",
    "sales": "Chris Lim",
    "source": "Energy Market",
    "email": "dtirrey3@dropbox.com",
    "address": "40650 Springview Street",
    "comment": "Mauris lacinia sapien quis libero.",
    "createdDate": subDays(now, 5),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 5,
    "name": "Alis Townes",
    "refID": "EM-698325",
    "phone": "0439 288 560",
    "status": "Win",
    "sales": "Fred Trim",
    "source": "Online",
    "email": "atownes4@bigcartel.com",
    "address": "62 Graceland Parkway",
    "comment": "Integer non velit.",
    "createdDate": subDays(now, 3),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 6,
    "name": "Patricio Winders",
    "refID": "SM-315184",
    "phone": "0439 058 712",
    "status": "Closed",
    "sales": "Chris Lim",
    "source": "Online",
    "email": "pwinders5@tripod.com",
    "address": "6494 Russell Terrace",
    "comment": "Ut at dolor quis odio consequat varius.",
    "createdDate": subDays(now, 1),
    "updatedDate": subDays(now, 0)
  }, {
    "id": 7,
    "name": "Berkly Tangye",
    "refID": "EM-460044",
    "phone": "0437 716 411",
    "status": "Rejected",
    "sales": "Chris Lim",
    "source": "Solar Market",
    "email": "btangye6@prnewswire.com",
    "address": "50717 Pleasure Hill",
    "comment": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.",
    "createdDate": subDays(now, 1),
    "updatedDate": subDays(now, 1)
  }, {
    "id": 8,
    "name": "Tades Feighney",
    "refID": "SM-734826",
    "phone": "0495 076 915",
    "status": "Closed",
    "sales": "Frank Gao",
    "source": "Solar Market",
    "email": "tfeighney7@reference.com",
    "address": "1519 Northfield Park",
    "comment": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio.",
    "createdDate": subDays(now, 5),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 9,
    "name": "Nike Kirman",
    "refID": "EM-476520",
    "phone": "0403 808 325",
    "status": "Win",
    "sales": "Fred Trim",
    "source": "Online",
    "email": "nkirman8@kickstarter.com",
    "address": "65587 Quincy Crossing",
    "comment": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
    "createdDate": subDays(now, 3),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 10,
    "name": "Matelda Rymmer",
    "refID": "SM-722298",
    "phone": "0426 097 429",
    "status": "New",
    "sales": "Reece Valvo",
    "source": "Local Champ",
    "email": "mrymmer9@nature.com",
    "address": "40 Londonderry Plaza",
    "comment": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    "createdDate": subDays(now, 4),
    "updatedDate": subDays(now, 3)
  }, {
    "id": 11,
    "name": "Rodina Webling",
    "refID": "OL-361579",
    "phone": "0405 679 349",
    "status": "New",
    "sales": "Fred Trim",
    "source": "Energy Market",
    "email": "rweblinga@bbc.co.uk",
    "address": "850 Nevada Center",
    "comment": "Nam tristique tortor eu pede.",
    "createdDate": subDays(now, 4),
    "updatedDate": subDays(now, 1)
  }, {
    "id": 12,
    "name": "Thornie Ewart",
    "refID": "EM-923130",
    "phone": "0468 169 341",
    "status": "Rejected",
    "sales": "Fred Trim",
    "source": "Online",
    "email": "tewartb@furl.net",
    "address": "41103 Chinook Point",
    "comment": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
    "createdDate": subDays(now, 3),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 13,
    "name": "Kalvin Reidshaw",
    "refID": "EM-457884",
    "phone": "0458 012 263",
    "status": "Closed",
    "sales": "Fred Trim",
    "source": "Local Champ",
    "email": "kreidshawc@networkadvertising.org",
    "address": "22632 Delaware Park",
    "comment": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
    "createdDate": subDays(now, 3),
    "updatedDate": subDays(now, 2)
  }, {
    "id": 14,
    "name": "Emmy Elcox",
    "refID": "EM-740844",
    "phone": "0490 460 590",
    "status": "New",
    "sales": "Chris Lim",
    "source": "Local Champ",
    "email": "eelcoxd@princeton.edu",
    "address": "940 Shoshone Terrace",
    "comment": "Donec semper sapien a libero. Nam dui.",
    "createdDate": subDays(now, 0),
    "updatedDate": subDays(now, 0)
  }, {
    "id": 15,
    "name": "Corabelle Giercke",
    "refID": "SM-401715",
    "phone": "0470 275 501",
    "status": "Win",
    "sales": "Fred Trim",
    "source": "Local Champ",
    "email": "cgierckee@weibo.com",
    "address": "6 Fallview Street",
    "comment": "Proin at turpis a pede posuere nonummy. Integer non velit.",
    "createdDate": subDays(now, 5),
    "updatedDate": subDays(now, 1)
  }, {
    "id": 16,
    "name": "Anastassia Tennock",
    "refID": "LC-530242",
    "phone": "0490 475 730",
    "status": "Closed",
    "sales": "Fred Trim",
    "source": "Local Champ",
    "email": "atennockf@histats.com",
    "address": "85 Muir Trail",
    "comment": "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
    "createdDate": subDays(now, 6),
    "updatedDate": subDays(now, 3)
  }, {
    "id": 17,
    "name": "Dan Kays",
    "refID": "EM-812838",
    "phone": "0434 006 591",
    "status": "Closed",
    "sales": "Chris Lim",
    "source": "Energy Market",
    "email": "dkaysg@so-net.ne.jp",
    "address": "027 Welch Plaza",
    "comment": "In eleifend quam a odio. In hac habitasse platea dictumst.",
    "createdDate": subDays(now, 5),
    "updatedDate": subDays(now, 4)
  }, {
    "id": 18,
    "name": "Maurine Plumtree",
    "refID": "OL-245300",
    "phone": "0485 939 249",
    "status": "Rejected",
    "sales": "Frank Gao",
    "source": "Local Champ",
    "email": "mplumtreeh@sakura.ne.jp",
    "address": "38749 Katie Park",
    "comment": "Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    "createdDate": subDays(now, 5),
    "updatedDate": subDays(now, 3)
  }, {
    "id": 19,
    "name": "Maryl Sang",
    "refID": "LC-520393",
    "phone": "0471 701 594",
    "status": "Rejected",
    "sales": "Frank Gao",
    "source": "Online",
    "email": "msangi@amazon.com",
    "address": "9 Welch Center",
    "comment": "Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    "createdDate": subDays(now, 6),
    "updatedDate": subDays(now, 4)
  }, {
    "id": 20,
    "name": "Florie Bettleson",
    "refID": "EM-936017",
    "phone": "0460 323 829",
    "status": "Rejected",
    "sales": "Frank Gao",
    "source": "Online",
    "email": "fbettlesonj@marketwatch.com",
    "address": "5 Sloan Junction",
    "comment": "Suspendisse accumsan tortor quis turpis.",
    "createdDate": subDays(now, 5),
    "updatedDate": subDays(now, 1)
  }
];

const lead = {
  "id": 19,
  "name": "Maryl Sang",
  "refID": "LC-520393",
  "phone": "0471 701 594",
  "status": "New",
  "sales": "Frank Gao",
  "source": "Local Champ",
  "email": "msangi@amazon.com",
  "address": "9 Welch Center",
  "comment": "Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  "createdDate": subDays(now, 6),
  "updatedDate": subDays(now, 4),
  "phase": 1,
  "story": '2',
  "roof": "Klip-Lok",
  "existingSystem": "New",
  "propertyComment": "Inverter has to be facing the south side of the property",
  "internalPrice": 4924,
  "totalPrice": 6500,
  "stcDiscount": 2000,
  "finalPrice": 4500,
  "discount": 8.61,
  "progress": "new",
  "currencySymbol": '$',
  "distributor": "Ausgrid",
  "retailer": "Origin",
  "meterNum": "304204",
  "nmi": "4103925782",
  "system": [
    {
      "type": "price",
      "name": "6.66 kW System",
      "quantity": 1,
      "unitAmount": 4500,
      "currencySymbol": '$',
      "totalAmount": 4500
    },
    {
      "type": "panel",
      "name": "Trina TSM390DE09.08",
      "quantity": 17,
      "unitAmount": 0,
      "currencySymbol": '$',
      "totalAmount": 0
    },
    {
      "type": "inverter",
      "name": "Fronius Primo 5.0",
      "quantity": 1,
      "unitAmount": 0,
      "currencySymbol": '$',
      "totalAmount": 0
    },
    {
      "type": "extra",
      "name": "Klip-Lok",
      "quantity": 17,
      "unitAmount": 20,
      "currencySymbol": '$',
      "totalAmount": 340
    },
    {
      "type": "extra",
      "name": "Transportation",
      "quantity": 1,
      "unitAmount": 84,
      "currencySymbol": '$',
      "totalAmount": 84
    }
  ],
  files: [
    {
      "id": 1,
      "type": "Panel Design",
      "name": "panel-design.pdf"
    },
    {
      "id": 2,
      "type": "Front of House",
      "name": "dlkasd.png"
    }
  ]
};

class LeadApi {
  async getLeads(options) {
    if (throttle) {
      await wait(throttle);
    }

    const { filters, sort, sortBy, page, query, view } = options;

    /*
     NOTE: Query, filter, sort and pagination are operation meant to be executed on the server.
     Since this does not connect to a real backend, we simulate these operations.
     */

    const queriedLeads = leads.filter((_lead) => {
      // If query exists, it looks only in customer id field
      if (!!query && !_lead.id?.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }

      // No need to look for any resource fields
      if (typeof view === 'undefined' || view === 'all') {
        return true;
      }

      // In this case, the view represents the resource status
      return _lead.status === view;
    });
    const filteredLeads = applyFilters(queriedLeads, filters);
    const sortedLeads = applySort(filteredLeads, sort, sortBy);
    const paginatedLeads = applyPagination(sortedLeads, page);

    return Promise.resolve({
      leads: paginatedLeads,
      leadsCount: filteredLeads.length
    });
  }

  async getLead() {
    if (throttle) {
      await wait(throttle);
    }

    return Promise.resolve(lead);
  }
}

export const leadApi = new LeadApi();
