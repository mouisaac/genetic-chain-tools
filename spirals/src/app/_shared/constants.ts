import { environment } from "src/environments/environment";

// the domain of Amazon CDN
// not sure why original relative url no longer work. Does it have to do with the changes in Angular.json?
export const domain = environment.production ? "https://d2i5f1mdntbhx.cloudfront.net" : '/assets';
//export const domain = "https://d2i5f1mdntbhx.cloudfront.net";
// original relative image url = "assets/images/";