import { subDays } from 'date-fns';
import { throttle } from '../config';
import { applyFilters } from '../utils/apply-filters';
import { applyPagination } from '../utils/apply-pagination';
import { applySort } from '../utils/apply-sort';
import { wait } from '../utils/wait';

const now = new Date();

const installs = [
    {
        id: 1,
        name: 'Jecho Follacaro',
        email: 'jfollacaro0@rediff.com',
        contactNum: '0417 341 021',
        streetAddress: '1124 Crownhardt Plaza',
        reference: 'SS-60842',
        status: 'payment',
        updatedDate: subDays(now, 2),
        createdDate: subDays(now, 9),
    },
    {
        id: 2,
        name: 'Moselle Bangley',
        email: 'mbangley1@mac.com',
        contactNum: '0484 961 933',
        streetAddress: '54964 Orin Plaza',
        reference: 'VS-33795',
        status: 'deposit',
        updatedDate: subDays(now, 9),
        createdDate: subDays(now, 6),
    },
    {
        id: 3,
        name: 'Jocko Prangnell',
        email: 'jprangnell2@slashdot.org',
        contactNum: '0401 274 369',
        streetAddress: '6 Hoffman Hill',
        reference: 'SS-05645',
        status: 'deposit',
        updatedDate: subDays(now, 5),
        createdDate: subDays(now, 3),
    },
    {
        id: 4,
        name: 'Muhammad Closs',
        email: 'mcloss3@wufoo.com',
        contactNum: '0408 407 889',
        streetAddress: '1 Bartelt Hill',
        reference: 'SS-20174',
        status: 'payment',
        updatedDate: subDays(now, 5),
        createdDate: subDays(now, 2),
    },
    {
        id: 5,
        name: 'Ram Orneles',
        email: 'rorneles4@weather.com',
        contactNum: '0463 720 414',
        streetAddress: '08345 Melrose Pass',
        reference: 'VS-44780',
        status: 'deposit',
        updatedDate: subDays(now, 8),
        createdDate: subDays(now, 7),
    },
    {
        id: 6,
        name: 'Collin Rideout',
        email: 'crideout5@youku.com',
        contactNum: '0433 336 291',
        streetAddress: '76373 Twin Pines Crossing',
        reference: 'VS-77440',
        status: 'deposit',
        updatedDate: subDays(now, 9),
        createdDate: subDays(now, 0),
    },
    {
        id: 7,
        name: 'Ellissa Casemore',
        email: 'ecasemore6@yale.edu',
        contactNum: '0487 079 162',
        streetAddress: '8219 Johnson Junction',
        reference: 'VS-39294',
        status: 'new',
        updatedDate: subDays(now, 6),
        createdDate: subDays(now, 4),
    },
    {
        id: 8,
        name: 'Chantalle Veare',
        email: 'cveare7@woothemes.com',
        contactNum: '0430 170 260',
        streetAddress: '498 Londonderry Circle',
        reference: 'VS-97164',
        status: 'schedule',
        updatedDate: subDays(now, 7),
        createdDate: subDays(now, 8),
    },
    {
        id: 9,
        name: 'Yasmeen Bebis',
        email: 'ybebis8@google.com.hk',
        contactNum: '0485 183 062',
        streetAddress: '983 Sauthoff Pass',
        reference: 'VS-72196',
        status: 'ptc',
        updatedDate: subDays(now, 5),
        createdDate: subDays(now, 4),
    },
    {
        id: 10,
        name: 'Carolynn Heifer',
        email: 'cheifer9@earthlink.net',
        contactNum: '0426 730 213',
        streetAddress: '2063 Artisan Lane',
        reference: 'VS-26675',
        status: 'retailer',
        updatedDate: subDays(now, 3),
        createdDate: subDays(now, 5),
    },
    {
        id: 11,
        name: 'Erinn Bontein',
        email: 'ebonteina@imdb.com',
        contactNum: '0465 875 898',
        streetAddress: '7784 Di Loreto Trail',
        reference: 'SS-53179',
        status: 'ptc',
        updatedDate: subDays(now, 3),
        createdDate: subDays(now, 8),
    },
    {
        id: 12,
        name: 'Morse Tapenden',
        email: 'mtapendenb@economist.com',
        contactNum: '0447 041 581',
        streetAddress: '220 Waywood Parkway',
        reference: 'SS-68763',
        status: 'new',
        updatedDate: subDays(now, 7),
        createdDate: subDays(now, 5),
    },
    {
        id: 13,
        name: 'Jack McCluin',
        email: 'jmccluinc@cnet.com',
        contactNum: '0480 561 420',
        streetAddress: '8 Coleman Trail',
        reference: 'SS-70158',
        status: 'new',
        updatedDate: subDays(now, 0),
        createdDate: subDays(now, 2),
    },
    {
        id: 14,
        name: 'Donnell Yendall',
        email: 'dyendalld@nba.com',
        contactNum: '0459 621 214',
        streetAddress: '82 Colorado Park',
        reference: 'SS-92377',
        status: 'review',
        updatedDate: subDays(now, 0),
        createdDate: subDays(now, 9),
    },
    {
        id: 15,
        name: 'Griffith Semple',
        email: 'gsemplee@wsj.com',
        contactNum: '0485 073 581',
        streetAddress: '57 Union Plaza',
        reference: 'VS-33689',
        status: 'payment',
        updatedDate: subDays(now, 4),
        createdDate: subDays(now, 1),
    },
    {
        id: 16,
        name: 'Millie Duferie',
        email: 'mduferief@psu.edu',
        contactNum: '0457 646 825',
        streetAddress: '52 Homewood Point',
        reference: 'SS-42948',
        status: 'payment',
        updatedDate: subDays(now, 1),
        createdDate: subDays(now, 2),
    },
    {
        id: 17,
        name: 'Joya Lunbech',
        email: 'jlunbechg@umn.edu',
        contactNum: '0428 570 732',
        streetAddress: '6972 Pleasure Avenue',
        reference: 'SS-49914',
        status: 'stc',
        updatedDate: subDays(now, 6),
        createdDate: subDays(now, 8),
    },
    {
        id: 18,
        name: 'Allin Garrioch',
        email: 'agarriochh@mashable.com',
        contactNum: '0486 295 604',
        streetAddress: '41 Independence Hill',
        reference: 'VS-21194',
        status: 'complete',
        updatedDate: subDays(now, 1),
        createdDate: subDays(now, 2),
    },
    {
        id: 19,
        name: 'Brose Saunton',
        email: 'bsauntoni@feedburner.com',
        contactNum: '0453 529 940',
        streetAddress: '99 John Wall Hill',
        reference: 'VS-84942',
        status: 'ptc',
        updatedDate: subDays(now, 6),
        createdDate: subDays(now, 9),
    },
    {
        id: 20,
        name: 'Kippy Seaking',
        email: 'kseakingj@typepad.com',
        contactNum: '0472 839 344',
        streetAddress: '34832 Glacier Hill Drive',
        reference: 'VS-33470',
        status: 'schedule',
        updatedDate: subDays(now, 6),
        createdDate: subDays(now, 3),
    },
];

const install = {
    id: 20,
    name: 'Kippy Seaking',
    email: 'kseakingj@typepad.com',
    contactNum: '0472 839 344',
    streetAddress: '34832 Glacier Hill Drive',
    reference: 'VS-33470',
    status: 'schedule',
    updatedDate: subDays(now, 6),
    createdDate: subDays(now, 3),
    phase: 1,
    story: '2',
    roof: 'Klip-Lok',
    existingSystem: 'New',
    propertyComment: 'Inverter has to be facing the south side of the property',
    internalPrice: 4924,
    totalPrice: 6500,
    stcDiscount: 2000,
    finalPrice: 4500,
    discount: 8.61,
    progress: 'new',
    currencySymbol: '$',
    distributor: 'Ausgrid',
    retailer: 'Origin',
    meterNum: '304204',
    nmi: '4103925782',
    system: [
        {
            type: 'System',
            name: '6.66 kW',
            quantity: 1,
            unitAmount: 4500,
            currencySymbol: '$',
            totalAmount: 4500,
        },
        {
            type: 'Panel',
            name: 'Trina TSM390DE09.08',
            quantity: 17,
            unitAmount: 0,
            currencySymbol: '$',
            totalAmount: 0,
        },
        {
            type: 'Inverter',
            name: 'Fronius Primo 5.0',
            quantity: 1,
            unitAmount: 0,
            currencySymbol: '$',
            totalAmount: 0,
        },
        {
            type: 'Extra',
            name: 'Fronius Smart Meter',
            quantity: 1,
            unitAmount: 20,
            currencySymbol: '$',
            totalAmount: 340,
        },
        {
            type: 'Extra',
            name: 'Klip-Lok',
            quantity: 17,
            unitAmount: 20,
            currencySymbol: '$',
            totalAmount: 340,
        },
    ],
    files: [
        {
            id: 1,
            type: 'Panel Design',
            name: 'panel-design.pdf',
        },
        {
            id: 2,
            type: 'Front of House',
            name: 'dlkasd.png',
        },
    ],
};

class InstallApi {
    async getInstalls(options) {
        if (throttle) {
            await wait(throttle);
        }

        const { filters, sort, sortBy, page, query, view } = options;

        /*
     NOTE: Query, filter, sort and pagination are operation meant to be executed on the server.
     Since this does not connect to a real backend, we simulate these operations.
     */

        const queriesInstalls = installs.filter((_install) => {
            // If query exists, it looks only in customer id field
            if (
                !!query &&
                !_install.id?.toLowerCase().includes(query.toLowerCase())
            ) {
                return false;
            }

            // No need to look for any resource fields
            if (typeof view === 'undefined' || view === 'all') {
                return true;
            }

            // In this case, the view represents the resource status
            return _install.status === view;
        });
        const filteredInstalls = applyFilters(queriesInstalls, filters);
        const sortedInstalls = applySort(filteredInstalls, sort, sortBy);
        const paginatedInstalls = applyPagination(sortedInstalls, page);

        return Promise.resolve({
            installs: paginatedInstalls,
            installsCount: filteredInstalls.length,
        });
    }

    async getInstall() {
        if (throttle) {
            await wait(throttle);
        }

        return Promise.resolve(install);
    }
}

export const installApi = new InstallApi();
