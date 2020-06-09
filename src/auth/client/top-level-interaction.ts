// Copied from https://github.com/Shopify/shopify_app
// TODO: koa-shopify-auth doesn't take in prefix, log a bug with them
const topLevelInteraction = (shop: string, prefix?: string) => {
  return `(function() {
      function setUpTopLevelInteraction() {
        var TopLevelInteraction = new ITPHelper({
          redirectUrl: ${prefix}/auth?shop=${shop},
        });

        TopLevelInteraction.execute();
      }

      document.addEventListener("DOMContentLoaded", setUpTopLevelInteraction);
    })();`;
};

export default topLevelInteraction;
