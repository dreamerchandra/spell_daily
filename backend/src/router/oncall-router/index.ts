import { Router, type Router as RouterType } from 'express';
import { getNowIST } from '../../utils/date.js';
import { env } from '../../config/env.js';
import { Vonage } from '@vonage/server-sdk';
import { NCCOBuilder, Talk } from '@vonage/voice';
import { logger } from '../../lib/logger.js';

const credentials = {
  applicationId: env.VONAGE_APP_ID,
  privateKey: env.VONAGE_API_SECRET,
};
const options = {};
const vonage = new Vonage(credentials, options);

const onCallRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/on-call';

const makePhoneCall = async () => {
  try {
    const builder = new NCCOBuilder();
    builder.addAction(new Talk('This is a text to speech call from Vonage'));
    const response = await vonage.voice.createOutboundCall({
      to: [
        {
          type: 'phone',
          number: '+918754791569',
        },
      ],
      from: {
        number: '12345678901',
        type: 'phone',
      },
      answerUrl: [],
      ncco: builder.build(),
    });
    logger.info('Phone call initiated:', response);
    return true;
  } catch (error) {
    logger.error('Error making phone call:', error);
    return false;
  }
};

onCallRouter.post(`${baseVersion}${baseRoute}`, (_req, res) => {
  void (async () => {
    try {
      logger.error(
        'On-Call route hit with request:',
        new Error(JSON.stringify(_req.body))
      );
      const isPhoneCallMade = await makePhoneCall();
      res.status(200).json({
        server: true,
        phoneCall: isPhoneCallMade,
        timeNow: getNowIST().toISOString(),
      });
    } catch (error) {
      logger.error('Error in on-call route:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  })();
});

export default [onCallRouter] as RouterType[];
