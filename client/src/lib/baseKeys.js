function getStripeKey() {
    let baseUrl = "https://crma-pay-developer-edition.na163.force.com/";
    var url = baseUrl +
      "InteractPay/services/apexrest/crma_pay/InterACTPayAuthorizationUpdated/?methodType=GET&inputParams={}";
    fetch(url, {
      method: "GET",
      headers: {
        mode: "cors",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.text())
      .then((response) => {
        // console.log(" Stripe key  -->" + JSON.stringify(response));
        // this.stripeKey = response;
        response = response.slice(1, response.length - 1);
        console.log("RESponse    ------>", response);
        var mdt_Reponse = JSON.parse(response);
        var orderReponse = JSON.stringify(JSON.parse(response));
        var stripeKey = mdt_Reponse.StripeKey;
        var brandLogo = mdt_Reponse.BrandLogo;
        var redirectUrl = mdt_Reponse.transactionRedirectUrl;
        console.log("this.brandLogo--->" + brandLogo);
      })
      .catch((err) => {
        console.log("err" + err);
      })
      .finally(() => {
          console.log("fghgfjhdgvjgjvghrjhgvjk");
        // this.getContactDetails();
        // if (this.urlContactId && !this.urlCustomerId) {
        //   console.log("******************************No Customer***********");
        //   console.log("window.name--->" + window.name);
        //   this.createCustomer(window.name, this.urlmail);
        // }
      });
  }