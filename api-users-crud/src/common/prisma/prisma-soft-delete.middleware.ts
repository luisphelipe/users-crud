import { Prisma } from '@prisma/client';

const SOFT_DELETE_MODELS = [
    'Device',
    'Battery',
    'Org',
    'BankAccount',
    'Location',
    'Client',
    'ScreenPlan',
    'ScreenAudio',
    'ScreenRent',
    'ScreenBack',
    'Transaction',
    'Payment',
    'AdvertisingCampaign',
    'AdvertisingContent',
];

export const PrismaSoftDeleteMiddlware = async (params: Prisma.MiddlewareParams, next: any) => {
    // Check incoming query type

    if (params.model && SOFT_DELETE_MODELS.includes(params.model)) {
        const deleted_at = new Date();

        if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update';
            params.args['data'] = { deleted_at };
        }
        if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany';
            if (params.args.data != undefined) {
                params.args.data['deleted_at'] = deleted_at;
            } else {
                params.args['data'] = { deleted_at };
            }
        }
    }
    return next(params);
};
