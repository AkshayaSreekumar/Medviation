import React, { useEffect, useState } from "react";
//import "./Stripe.css";
import WireTransferCardList from "./WireTransferCardList/WireTransferCardList";
import { Modal, Button, Placeholder } from 'react-bootstrap';
// import Ccard from '../Card/Ccard';
 import AddCard from '../CardManager/AddCard/AddCard'
 import Spinner from '../Spinner/spinner';
 import Alert from '../Alert/Alert';
 //import text from '../ReadText';

interface cardDataformat {
  id: string;
  bank_name: string;
  //customId: string;
  card: {
    last4: string;
    exp_year: string;
    exp_month: string;
    brand: string;
  },
  billing_details: {
    address: {
      city: string,
      country: string,
      state: string,
      line1: string,
      line2: string,
      postal_code: string,
    }
  };
  selectedCardPayment: (id: string, billing_details: {
    address: {
      city: string,
      country: string,
      state: string,
      line1: string,
      line2: string,
      postal_code: string,
    }
  }, card: {
    brand: string
  }) => void;
  pageValidity:(isValid: boolean) => void;
    oppId: string | null;
    quoteId: string | null;
    orderId: string | null;
    mailId: string | null;
    contId: string | null;
    linkId: string | null;
    customerId: string | null;
    dueAmount: string | null;
    baseUrlValue: string | null;
    reqNumber: string | null;
  //linkValidity: string;
}

const Stripe = (props: any) => {
  const [alert,setAlert] = useState({});
  const [isLoader, setIsLoader] = React.useState(false);
  const [paymentExist, setPaymentExist] = React.useState(false);
  const [cardList, setCardList] = useState<cardDataformat[]>([]);
  const [isshowAddress, setIsShowAddress] = useState(false);
  const [show, setShow] = useState(false);
  const [holdButton, setHoldButton] = React.useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [varx, setVarx] = useState<string | null>(null);
  const [oppId, setOppId] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [mailId, setMailId] = useState<string | null>(null);
  const [contId, setContId] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [dueAmount, setDueAmount] = useState<string | null>(null);
  const [baseUrlValue, setBaseUrlValue] = useState<string | null>(null);
  const [reqNumber, setReqNumber] = useState<string | null>(null);
  // const [expiredLink, setExpiredLink] = React.useState(false);
  // const [childData, setChildData] = useState({
  //   name: 'unknown',
  //   age: 'unknown'
  // });
  // const passData = (data) => {
  //   setChildData(data);
  // };

  useEffect(() => {
    //let x= env.PLAID_CLIENT_ID;
    console.log("props.apicustomerid" + props.apicustomerid);
    loadCardData(props.apicustomerid);
    setCustomerId(props.apicustomerid);
    //let y = props.vary;
    console.log("useeffect-->quoteId"+props.quoteId);
    if(props.oppId && props.quoteId && props.orderId && props.mailId && props.contId && props.linkId && props.dueAmount && props.baseUrlValue && props.reqNumber){
      setOppId(props.oppId);
    setQuoteId(props.quoteId);
    setOrderId(props.orderId);
    setMailId(props.mailId);
    setContId(props.contId);
    setLinkId(props.linkId);
    setDueAmount(props.dueAmount);
    setBaseUrlValue(props.baseUrlValue);
    setReqNumber(props.reqNumber);
    }
    
    console.log("order- details in transaction->"+orderId+"email-->"+mailId+"contact-->"+contId+"quote-->"+quoteId+"opport-->"+oppId);
  }, []);

  const loadCardData = (cusId: string) => {
    console.log("invoked Card()!!!!");
    fetch(
      "https://api.stripe.com/v1/payment_methods?type=card&customer=" + cusId,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "https://api.stripe.com",
          Authorization:
            " Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("Card list--------------" + JSON.stringify(response));
        setCardList(response.data);
        if (response.data) {
          setPaymentExist(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
// const linkValidity = () =>{
//   console.log("invoked link validity");
// }
  const selectedCard = (id: string, billing_details: {},card:{}) => {
    console.log(id, billing_details,card);
    props.selectedCardPayment(id, billing_details,card)
  };
  const pageValidity =(isValid: boolean) => {
    //setexpiredLink(isValid);
    props.linkValidity(isValid);
}
  const handleClose = () => { setShow(false) };
  const handleShow = () => setShow(true);
  const handleAddCard = () => {
    setShow(true)
  }
  const createPaymentMethod = (cardNumber:string,cvv:string,validMonth:string,validYear:string,billingLine1:string,billingLine2:string,billingCity:string,billingCountry:string,billingState:string,billingPostalcode:string) => {
    setIsLoader(true);
    var createMethodUrl =
      "https://api.stripe.com/v1/payment_methods"
      +
      "?type=card&card[number]=" +
      cardNumber +
      "&card[exp_month]=" +
      validMonth +
      "&card[exp_year]=" +
      validYear +
      "&card[cvc]=" +
      cvv +
      "&billing_details[address[city]]=" + billingCity + "&billing_details[address[line1]]=" + billingLine1 + "&billing_details[address[country]]=" + billingCountry + "&billing_details[address[postal_code]]=" + billingPostalcode + "&billing_details[address[state]]=" + billingState;
    console.log("createcard url-->" + createMethodUrl);

    fetch(createMethodUrl, {
      method: "POST",
      headers: {
        "x-rapidapi-host": "https://api.stripe.com",
        Authorization: "Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.id) {
          console.log(response);
          attachPaymentmethod(response.id, props.apicustomerid)
        } else {
          var message = response.error.message;
        }
      }).catch((err) => {
        console.log(err);
        var message = " Error Occurred";
        var type = "error";
      });
  }

  const attachPaymentmethod = (paymentMethodId: string, customerId: string) => {
    console.log("this.customerId in attachPaymentmethod---->" + paymentMethodId, customerId);
    //props.selectedCustomerId(customerId);
    var attachUrl =
      "https://api.stripe.com/v1/payment_methods/" +
      paymentMethodId +
      "/attach?customer=" +
      customerId;
    fetch(attachUrl, {
      method: "POST",
      headers: {
        "x-rapidapi-host": "https://api.stripe.com",
        Authorization: "Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("attach payment medthod----->", response);
        setAlert({status:'success',message:'New payment method is added sucessfully'})
        loadCardData(props.apicustomerid);
        setIsLoader(false);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        var message = " Error Occurred";
        var type = "error";
      });
  }
  const getCardvalues = (cardinputs: {
    id: string;
    cardNumber: string;
    cardHolder: string;
    cardMonth: string;
    cardYear: string;
    cardCvv: string;
    addrressline1: string;
    addrressline2: string;
    country: string;
    city: string;
    state: string;
    postalCode: string
  }) => {
    console.log(JSON.stringify(cardinputs.cardHolder));
    console.log(cardinputs.cardNumber, cardinputs.cardCvv, cardinputs.cardMonth, cardinputs.cardYear, cardinputs.addrressline1, cardinputs.addrressline2, cardinputs.city, cardinputs.country, cardinputs.state && cardinputs.postalCode)
    if (cardinputs.cardNumber && cardinputs.cardCvv && cardinputs.cardMonth && cardinputs.cardYear && cardinputs.addrressline1 && cardinputs.addrressline2 && cardinputs.city && cardinputs.country && cardinputs.state && cardinputs.postalCode) {
      createPaymentMethod(cardinputs.cardNumber,cardinputs.cardCvv,cardinputs.cardMonth,cardinputs.cardYear,cardinputs.addrressline1,cardinputs.addrressline2,cardinputs.city,cardinputs.country,cardinputs.state,cardinputs.postalCode);
    }
  };
  function refreshComponent() {
    setIsLoader(true);
    loadCardData(props.apicustomerid);
    //setCustomerId(props.apicustomerid);
    setIsLoader(false);
  }
  async function createHold() {
    // setIsLoader(true);
    // fetch(paymentUrl + '&amount=' + totalAmount, {
    //     method: "POST",
    //     headers: {
    //         "x-rapidapi-host": "https://api.stripe.com",
    //         Authorization: " Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",
    //         "Idempotency-Key": idempotencyKey,
    //     },
    // })
    //     .then((response) => response.json())
    //     .then((response) => {
    //         console.log(JSON.stringify('PaymentReaponse' + response));
    //         let transactionId = response.id;
    //         let transactionstatus = response.status;
    //         let gatewayMessage = JSON.parse(
    //             JSON.stringify(response.charges.data[0].outcome.seller_message)
    //         );
    //         let gatewayStatus = JSON.parse(
    //             JSON.stringify(response.charges.data[0].outcome.network_status)
    //         );
    //         let currencyCode = response.currency;
    //         var localKey = localStorage.getItem('RandomKey');
    //         setIsLoader(false);
    //         if (localKey !== idempotencyKey) {
    //             createTransactionRecord(transactionId, transactionstatus, gatewayMessage, gatewayStatus, currencyCode);
    //         }
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}
  return (
    <>
      {isLoader ? <Spinner /> : null}
      <Alert alert={alert} setAlert={setAlert}/>
      <div className="text-end">
        <button className="btn btn-outline-success btn-sm lnch-btn my-2 rounded-pill rounded-pill" onClick={() => handleShow()}>
          Add new card
        </button>
      </div>
      {paymentExist ?
       <WireTransferCardList  
       cardList={cardList} 
       selectedCard={selectedCard}
       pageValidity={pageValidity}
        refreshComponent={refreshComponent}
        oppId={oppId}
        quoteId={quoteId}
        orderId={orderId}
        mailId={mailId}
        contId={contId}
        linkId={linkId}
        customerId={customerId}
        dueAmount={dueAmount}
        baseUrlValue={baseUrlValue}
        reqNumber={reqNumber}
       //linkValidity={linkId}
       />
        : <div className="card card-body bg-light- d-flex flex-row justify-content-between align-items-center"><Placeholder className="w-100 h9" animation="glow">
        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
        <Placeholder xs={6} /> <Placeholder xs={8} />
      </Placeholder></div>}
      {/* <div className="text-end m-3">
        <button className="btn btn-primary d-block h8 w-50" onClick={() => handleShow()} disabled={!holdButton}>
          Make a Wire Transfer
        </button>
      </div> */}
      <div className='d-block'>
        <Modal show={show} onHide={handleClose}
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header className='border-0 pb-0'>
            <Modal.Title className='fw-bold h6'>Add new card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddCard getCardvalues={getCardvalues} handleClose={handleClose} />

          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default Stripe;
