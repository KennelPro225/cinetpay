# **Unofficial** node module including the [cinetpay](https://cinetpay.com) api functions
So the idea came to me when I was trying to use the [cinetpay](https://cinetpay.com) api in my vuejs application, I was not able to do so because Vuejs does not render divs with the src , and I tought it would be cool to have a node module that could be used in vuejs and any other javascript framework.
## DISCLAIMER
This package is an unofficial node module that is not supported by CinetPay. I am not affiliated with CinetPay. However, I can guarantee that this package is safe and will not cause any harm to your application. I will make everyting I can to make sure that this package will becomne official and supported by cinetpay in the future, but I can not guarantee that it will be so.
## INSTALLATION
Install the package with npm:

```bash
npm install node-cinetpay
```
## USAGE
Once installed, you can use the package like this:
```js
import { Cinetpay } from 'node-cinetpay';
const cinetpay = new Cinetpay.setConfig({
  apiKey: 'your_api_key',
  site_id: your_site_id,
  mode: 'SANDBOX',
  notify_url: 'http://your_domain.com/notify',
});
```
And that's it! Everything else you might need is already implemented in the package and you can refer to the [official documentation](https://docs.cinetpay.com/api/1.0-fr/sdk/js) for more information.

In the future, I will try to add more features to this package, so stay tuned!