import * as Brevo from '@getbrevo/brevo';
import env from './env.js';

const isBrevoConfigured = env.BREVO_API_KEY && !env.BREVO_API_KEY.includes('your-');

let apiInstance = null;
if (isBrevoConfigured) {
  apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY);
}

export { apiInstance, isBrevoConfigured };
