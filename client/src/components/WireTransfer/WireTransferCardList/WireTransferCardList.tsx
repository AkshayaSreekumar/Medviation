import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Modal, Button, Placeholder, Dropdown, Form } from 'react-bootstrap';
import Alert from '../../Alert/Alert';
import Accordion from 'react-bootstrap/Accordion';
import { json } from 'stream/consumers';
import { numberFormat } from '../../../lib/numberFormat';
import Spinner from '../../Spinner/spinner'
interface AccInterface {
  cardList: {
    id: string, bank_name: string, billing_details: {
      address: {
        city: string,
        country: string,
        state: string,
        line1: string,
        line2: string,
        postal_code: string,
      }
    }, card: {
      last4: string;
      exp_year: string;
      exp_month: string;
      brand: string;

    }
  }[];

  selectedCard: (id: string, billing_details: {
    address: {
      city: string,
      country: string,
      state: string,
      line1: string,
      line2: string,
      postal_code: string,
      //linkValid: true,
    }
  }, card: {
    brand: string
  }) => void;
  pageValidity: (isValid: boolean) => void;
  refreshComponent: () => void;
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
  // linkValidity: string;
}
const StripeCardList: React.FC<AccInterface> = (props) => {

  const [isLoader, setIsLoader] = React.useState(false);
  const [alert, setAlert] = useState({});
  const [show, setShow] = useState(false);
  const [holdShow, setHoldShow] = useState(false);
  const [action, setAction] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [showAmountCard, setShowAmountCard] = useState(false);
  const [holdButton, setHoldButton] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [payableAmount, setPayableAmount] = useState<string | null>(null);
  //const [payableAmount, setPayableAmount] = useState<string>();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleHoldClose = () => {

    setHoldShow(false);
    setAccordianBody(false);
    setHoldButton(false);
  };
  const handleHoldShow = () => {
    setIsLoader(false);
    setHoldShow(true)
    //setActivekey('0')
  };
  const handleShowAmountCard = () => setShowAmountCard(true);
  const handlewireClose = () => {
    setWireTransferInstructions(false);
    //navigateTo();
  }
  const handleemailClose = () => {
    setEmailConfirmation(false)
    navigateTo();
    //props.pageValidity(true);
  };
  //const [handleemailModalClose, setHandleemailModalClose] = React.useState(false);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [orderidUrl, setOrderidUrl] = useState<string | null>(null);
  const [urlContactId, setUrlContactId] = useState<string | null>(null);
  const [todaysDate, setTodaysDate] = useState<string | null>(null);
  const [urlmail, setUrlmail] = useState<string | null>(null);
  const [orderOpportunity, setOrderOpportunity] = useState<string | null>(null);
  const [orderQuote, setOrderQuote] = useState<string | null>(null);
  const [payLink, setPayLink] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [payMethodId, setPayMethodId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<string | null>(null);
  const [holdWireButton, setHoldWireButton] = React.useState(false);
  // const [activekey, setActivekey] = React.useState('1');
  const [wireTransferInstructions, setWireTransferInstructions] = React.useState(false);
  const [emailConfirmation, setEmailConfirmation] = React.useState(false);
  const cradListContainer = useRef(null);
  const [oppId, setOppId] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [mailId, setMailId] = useState<string | null>(null);
  const [contId, setContId] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  //const [linkValidity, setLinkValidity] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [dueAmount, setDueAmount] = useState<string | null>(null);
  const [baseUrlValue, setBaseUrlValue] = useState<string | null>(null);
  const [balAmount, setBalAmount] = useState<string | null>(null);
  const [holdAmount, setHoldAmount] = useState<string | null>(null);
  const [balAmountText, setBalAmountText] = React.useState(false);
  const [accordianBody, setAccordianBody] = React.useState(false);
  const [pageValidity, setPageValidity] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [reqNumber, setReqNumber] = useState<string | null>(null);
  const [oppNumber, setOppNumber] = useState<string>();
  const [expiredLink, setExpiredLink] = React.useState(false);
  //const transArray[any];
  //const [transList, setTransList] = useState([]);
  const [transList, setTransList] = useState<string[]>([]);
  const [transId, setTransId] = useState<string | null>(null);
  // const items = [];
  //const testArray = [];
  var testArray: string[] = [];
  //   this.state = {
  //     decorators = [],
  //     polyPaths = [],
  // }
  function refreshCardList() {
    console.log("invoked refresh");
    props.refreshComponent();
  }
  useEffect(() => {
    console.log("invoked env ");
    if (baseUrlValue) {
      getWireTransferDetails();
    }
    // if (payableAmount) {
    //   amountValidation();
    // }
    if (transactionId && payMethodId) {
      console.log("invokeed confirm hold from use effeect"+payMethodId);
      confirmHold(transactionId, payMethodId);
    }
    if (transList) {
      console.log("invoked local storage---xxxx>" + transList);
      //setTransList([...transList,transId]);
      //  console.log("useEffect-->"+JSON.stringify(transList));
      //  var x = "test value in local"
      //localStorage.setItem('Transactionlist', JSON.stringify(transList));
      //console.log("get local storage item"+JSON.parse(localStorage.Transactionlist("names")));
    }
    if (props.oppId && props.quoteId && props.orderId && props.mailId && props.contId && props.linkId && props.customerId && props.dueAmount && props.baseUrlValue && props.reqNumber) {
      console.log("invoke mailId,mailId mailId in use effect" + props.baseUrlValue);
      setOppId(props.oppId);
      setQuoteId(props.quoteId);
      setOrderId(props.orderId);
      setMailId(props.mailId);
      setContId(props.contId);
      setLinkId(props.linkId);
      setCustomerId(props.customerId);
      //setDueAmount(props.dueAmount);
      setTotalAmount(props.dueAmount);
      setBaseUrlValue(props.baseUrlValue);
      let oppNum = String(props.reqNumber);
      setOppNumber(oppNum);
      //setBalAmount(props.dueAmount);
      //setReqNumber(props.reqNumber);
    }
    const current = new Date();
    setTodaysDate(`${current.getFullYear()}-${current.getMonth() + 1
      }-${current.getDate()}`);
  }, [payLink, transactionId, payMethodId, transId, transList, baseUrlValue, payableAmount])
  const showDropdown = (id: string) => {
    console.log("myContainer.. in showDropdown ", cradListContainer.current);
    handleShowAmountCard();
  }
  const deletePaymentMethod = (id: string) => {
    console.log("myContainer..", cradListContainer.current);
    setDeleteCardId(id);
    handleShow();
  }
  function ConfirmDelete() {
    var deleteUrl = "https://api.stripe.com/v1/payment_methods/" + deleteCardId + "/detach";
    fetch(deleteUrl,
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "https://api.stripe.com",
          Authorization: " Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",

        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(" delete response -->" + JSON.stringify(response));
        handleClose()
        refreshCardList();
        setAlert({ status: 'success', message: 'Payment Method is removed Sucessfully' });
      })
      .catch((err) => {
        console.log(err);
        setAlert({ status: 'fail', message: err.message });
      });

  }
  function showCardActions() {
    setAction(true);
  }
  function amountValidation() {
    if (balAmount) {
      console.log("if balAmount"+balAmount);
      console.log("if balAmount payableAmount"+payableAmount);
      if (Number(balAmount) < Number(payableAmount)) {
        console.log("if balamount");
        setErrorMessage(true);
        setHoldButton(false);
      } else { setErrorMessage(false); }
    }
    else if (totalAmount) {
      console.log("if totalAmount");
      if (Number(totalAmount) < Number(payableAmount)) {
        setErrorMessage(true);
        setHoldButton(false);
      } else { setErrorMessage(false); }
    }
  }
  function showWireTransferInstructions() {
    console.log("invoked wiretransferInstructions");
    setWireTransferInstructions(true);
    updatePaymentLinkRecord();
  }
  function showAccordianBody() {
    console.log("invoked wiretransferInstructions");
    setAccordianBody(true);
  }
  const createHold = (id: string) => {
    console.log("invoked create hold method"+payMethodId);
    setErrorMessage(false);
    setIsLoader(true);
    console.log("payableAmount" + payableAmount);
    setPayMethodId(id);
    setHoldAmount(payableAmount);
    if (!balAmountText) {
      console.log("inside initial"+id);
      var balanceAmount = Number(totalAmount) - Number(payableAmount);
    }
    else {
      var balanceAmount = Number(balAmount) - Number(payableAmount);
    }
    let amountbal = balanceAmount;
    if (amountbal > 0) {
      console.log("balance amount greater than 0");
      setBalAmountText(true);
    }
    else {
      checkWireTransfer();
      setBalAmountText(false);
    }
    setBalAmount(JSON.stringify(amountbal));
    console.log("xxxxx-->" + amountbal);
    fetch('https://api.stripe.com/v1/payment_intents?amount=' + payableAmount + '00&currency=usd&payment_method_types[]=card&capture_method=manual&payment_method=' + id + '&customer=' + customerId
      , {
        method: "POST",
        headers: {
          "x-rapidapi-host": "https://api.stripe.com",
          Authorization: " Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",

        },
      })
      .then((response) => response.json())
      .then((response) => {
        let transactionId = response.id;
        setTransactionId(transactionId);
        console.log("transid" + transactionId);
        if (transactionId) {
          //confirmHold(transactionId,id);
          console.log("paylinkid" + payLink);
          //setIsLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function confirmHold(transactionId: string | null, paymentmethodId: string | null) {
    console.log("confirm hold invoked");
   setErrorMessage(false);
    //setIsLoader(true);
    fetch('https://api.stripe.com/v1/payment_intents/' + transactionId + '/confirm?payment_method=' + paymentmethodId
      , {
        method: "POST",
        headers: {
          "x-rapidapi-host": "https://api.stripe.com",
          Authorization: " Bearer sk_test_51KFJFDEgsgymTP2QQphWcJtpro03YRfRlWeafatGJpjzXkxu8n79rCl10wrGyMz4avPssaWO0lrnsnvxd2gdLVsd00OCD5BLVA",
          //"Idempotency-Key": idempotencyKey,
        },
      })
      .then((response) => response.json())
      .then((response) => {
        let transactionId = response.id;
        console.log("transid confirm" + transactionId);
        console.log("response" + JSON.stringify(response));
        if (transactionId) {
          let transactionstatus = response.status;
          let gatewayMessage = JSON.parse(
            JSON.stringify(response.charges.data[0].outcome.seller_message)
          );
          let gatewayStatus = JSON.parse(
            JSON.stringify(response.charges.data[0].outcome.network_status)
          );
          let currencyCode = response.currency;
          var localKey = localStorage.getItem('RandomKey');
          // setIsLoader(false);
          //getinputParams(payLink);
          createTransactionRecord(transactionId, transactionstatus, gatewayMessage, gatewayStatus, currencyCode);
          //console.log("order-->"+orderidUrl+"email-->"+urlmail+"contact-->"+urlContactId+"quote-->"+orderQuote+"opport-->"+orderOpportunity);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const updatePaymentLinkRecord = () => {
    console.log("Invoked Update PayLink");
    var payLinkRcdParams = {
      paymentLinkId: linkId,
      Active: false
    };
    var url =
      baseUrlValue +
      "InteractPay/services/apexrest/crma_pay/InterACTPayAuthorizationUpdated/?methodType=POST&inputParams=" +
      JSON.stringify(payLinkRcdParams);
    console.log("this.final transaction url --->" + url);
    fetch(url, {
      method: "GET",
      headers: {
        mode: "cors",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(" update  payLink-->" + JSON.stringify(response));
      })
      .catch((err) => {
        console.log("err" + err);
      });
  }
  function checkWireTransfer() {
    setHoldWireButton(true);
  }
  function createTransactionRecord(
    transactionId: string,
    transactionstatus: string,
    gatewayMessage: string,
    gatewayStatus: string,
    currencyCode: string
  ) {

    // setIsLoader(true);
   // setErrorMessage(false);
    console.log("invode transaction creation");
    var transactionParams = {
      paymentGatewayIdentifier: transactionId,
      Amount: payableAmount,
      transactionEmail: mailId,
      transactionCurrencyCode: currencyCode,
      transactionOrder: orderId,
      transactionContact: contId,
      processedDateTime: todaysDate,
      transactionStatus: transactionstatus,
      gatewayMessage: gatewayMessage,
      gatewayNetworkStatus: gatewayStatus,
      transactionQuote: quoteId,
      transctionOpportunity: oppId,
      billingStreet: null,
      billingCity: null,
      billingCountry: null,
      billingState: null,
      billingZip: null

    };

    var url = baseUrlValue +
      "InteractPay/services/apexrest/crma_pay/InterACTPayAuthorizationUpdated/?methodType=POST&inputParams=" +
      JSON.stringify(transactionParams);
    console.log("this.final transaction url --->" + url);
    fetch(url, {
      method: "GET",
      headers: {
        mode: "cors",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          console.log('LstResponse------------------------->' + response);
          //setTransId(response);
          //testArray.push(response);
          //console.log("items--->"+testArray);
          //setTransList(response);
          setTransList([...transList, response]);
          testArray.push(response);
          console.log("testArray" + testArray);
          //localStorage.setItem('testArray', response);
          // transArray.push(response);
          // console.log("transArray"+transArray);
          //setTransList(response);
          //setTransList(transList.push(response));
          //localStorage.setItem('Transactionlist', JSON.stringify(transList));
          var xy = response;
          console.log("xxxx->" + xy);
          handleHoldShow();
          //checkWireTransfer();
          //setIsLoader(false);
        }
        console.log(" create  transaction-->" + JSON.stringify(response));
      })
      .catch((err) => {
        setAlert({ status: 'fail', message: 'Something went wrong' });
        console.log("err in creating transaction" + err);
      });
  }
  function getWireTransferDetails() {
    console.log("Invoked getWireTransferDetails");
    var wireTransferParams = {
      fileName: "WireTransferDetails"
    };
    console.log("test11" + baseUrlValue);
    var url =
      baseUrlValue +
      "InteractPay/services/apexrest/MedviationAuthorization?methodType=GET&inputParams=" +
      JSON.stringify(wireTransferParams);
    console.log("test22" + url);
    //console.log("this.final transaction url --->" + url);
    fetch(url, {
      method: "GET",
      headers: {
        mode: "cors",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(" getWireTransferDetails" + JSON.stringify(response));
      })
      .catch((err) => {
        console.log("err" + err);
      });
  }
  function navigateTo() {
    console.log("Invoked navigation function-->");
    window.location.href = 'https://medviation.com/';
  }
  const handleEmailConfirmAction = () => {
    console.log("emailid-->" + oppNumber);
    console.log("transid list-->" + transList);
    //console.log("emailid-->"+transArray);
    var inputParams = { mailId: mailId, oppNumber: oppNumber, transList: transList };
    var url = baseUrlValue + "InteractPay/services/apexrest/MedviationAuthorization?methodType=GET&inputParams=" +
      JSON.stringify(inputParams);
    console.log("this.final email url payment --->" + url);
    fetch(url, {
      method: "GET",
      headers: {
        mode: "cors",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          console.log('LstResponse------------------------->' + response);
          handlewireClose();
          setEmailConfirmation(true);
        }
      })
      .catch((err) => {
        setIsLoader(false);
        setAlert({ status: 'fail', message: 'Something went wrong' });
        console.log("err" + err);
      });
  }
  console.log("StripeAccountList" + JSON.stringify(props.cardList))
  return (<div className='acc-list'>
    {balAmountText ? <p className="textmuted">Your amount due is {numberFormat(balAmount)}</p> : null}
    {isLoader ? <Spinner /> : null}
    <Alert alert={alert} setAlert={setAlert} />
    {

      props.cardList.map(acc => {
        return (
          <label key={acc.id}>
            <Accordion  >
              <Accordion.Item eventKey="0" id={acc.id} onChange={props.selectedCard.bind(null, acc.id, acc.billing_details, acc.card)}>
                <Accordion.Header onClick={showAccordianBody}>  <div className='col-2 py-1'>
                  <img
                    src={`/card-type/${acc.card.brand}.svg`}
                    alt="" className='CardListIcon'
                  />
                </div>
                  <div className='col-10'>
                    <p className='fw-bold h7 mb-0'><span className='ccNumber position-relative'>XXXXXXXX{acc.card.last4}</span></p>
                    <p className='h8 mb-1'><span className='textmuted h8'> Valid Upto</span><span className='ms-md-2'>{acc.card.exp_month}</span> / <span>{acc.card.exp_year}</span></p>
                    <div>
                    </div>
                  </div></Accordion.Header>
                {accordianBody ? <Accordion.Body>
                  <label className="list-group-item">
                    <div className="row">
                      <div className='py-2'>
                        Enter the amount to hold from this card
                      </div>
                      <div className='col-6 text-end'>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input type="text" className="form-control border-end-0 text-end pe-0" aria-label="Amount (to the nearest dollar)"
                            onKeyUp={(e) => {
                              setPayableAmount(e.currentTarget.value); setHoldButton(true);
                            }} />
                          <span className="input-group-text bg-transparent ps-0">.00</span>
                        </div>
                      </div>
                      <div className=" col-6 text-end">
                        <button className="btn btn-primary" onClick={createHold.bind(null, acc.id)} disabled={!holdButton}>
                          Place a Hold
                        </button>
                      </div>
                    </div>
                    {/*---------------------------------------*/}
                    {errorMessage ? <div className="row">
                      {/* <div >
                      </div> */}
                      <div >
                        <small id="passwordHelp" className="text-danger">
                          Amount should be less than due amount.
                        </small>
                      </div>
                    </div> : null}
                    {/*---------------------------------------*/}
                  </label>
                </Accordion.Body> : null}
              </Accordion.Item>
            </Accordion>
          </label>
        )

      })

    }

    <div className="text-end m-3">
      <button className="btn btn-primary d-block h8 w-50" onClick={showWireTransferInstructions} disabled={!holdWireButton}>
        Make a Wire Transfer
      </button>
    </div>
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header >
        <Modal.Title className='fw-bold h6'><i className="fa fa-exclamation-triangle text-warning me-3" aria-hidden="true"></i>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>This payment method will no longer be usable for you !.</Modal.Body>
      <Modal.Footer className='pt-0 border-top-0'>
        <Button variant="secondary" size="sm" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" size="sm" onClick={ConfirmDelete}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
    <Modal show={holdShow} onHide={handleHoldClose} centered>
      <Modal.Header className='h5 fw-bold'>
        {/* <Modal.Title className='fw-bold hstack'> */}
        <i className="text-warning me-3" aria-hidden="true"></i> An amount of {numberFormat(holdAmount)} is placed as hold on your credit card
        {/* </Modal.Title> */}
      </Modal.Header>
      <Modal.Body><p className='mx-4'>This amount will be released after a successful completion of wire transfer.</p><p className='mx-4'>Your amount due is {numberFormat(balAmount)}</p>
        {balAmountText ? <p className='mx-4'>Place another hold of {numberFormat(balAmount)}</p> : null}</Modal.Body>
      <Modal.Footer className='pt-0 border-top-0'>
        <Button variant="secondary" size="sm" onClick={handleHoldClose}>
          Close
        </Button>
        {/* <Button variant="danger" size="sm" onClick={ConfirmDelete}>
          Remove
        </Button> */}
      </Modal.Footer>
    </Modal>
    <Modal show={wireTransferInstructions} onHide={handlewireClose} centered>
      {/* <Modal.Header className='h5 fw-bold'>
        {/* <Modal.Title className='fw-bold h6'> */}
      {/* <p className='my-3'>
          <i className="text-warning me-3" aria-hidden="true"></i>Wire Transfer Details</p> */}
      {/* <p className='mx-4' >Please provide the following details to your bank while making the wire transfer</p> */}
      {/* </Modal.Title> */}
      {/* </Modal.Header> */}
      <Modal.Body>
        {/* Your amount due is $ 0.00. */}
        <div className="card-form">
          <p className='mx-4 fw-bold' >Please provide the following details to your bank while making the wire transfer</p>
          <div className="card-list">
            {/* {children} */}
          </div>
          <div className="card-form__inner">
            <div className="card-input">
              <div className="row mt-4">
                <div className="col-6">
                  <div className="ps-sm-4 text-black-50">Account Holder Name</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="AccountHolderName"
                    value="Medviation LLC"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                </div>
                <div className="col-6">
                  <div className="ps-sm-4 text-black-50">Account Number</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="AccountNumber"
                    value="376000000000006"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                </div>
                <div className="col-6">
                  <div className="ps-sm-4 text-black-50">Routing Number</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value="0000123456789"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                </div>
                <div className="col-6">
                  <div className="ps-sm-4 text-black-50">Swift Code</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value="CHASUS33XXX"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                </div>
                <div className="col-6">
                  <div className="ps-sm-4 text-black-50">Bank Name</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value="JPMorgan Chase & Co."
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                </div>
                <div className="col-6"> <div className="ps-sm-4 text-black-50">Bank Address</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value=" 1572 Bagwell Avenue"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                  {/* <Form.Control.Feedback type="invalid">
                {errors.cardHolder}
              </Form.Control.Feedback> */}
                </div>
                <div className="col-4"> <div className="ps-sm-4 text-black-50">City</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value="Gainesville"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                  {/* <Form.Control.Feedback type="invalid">
                {errors.cardHolder}
              </Form.Control.Feedback> */}
                </div>
                <div className="col-4"> <div className="ps-sm-4 text-black-50">State</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value="Florida"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                  {/* <Form.Control.Feedback type="invalid">
                {errors.cardCvv}
              </Form.Control.Feedback> */}
                </div>
                <div className="col-4"> <div className="ps-sm-4 text-black-50">Zip Code</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value="32601"
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                  {/* <Form.Control.Feedback type="invalid">
                {errors.cardCvv}
              </Form.Control.Feedback> */}
                </div>
                <div className="col-12"> <div className="ps-sm-4 text-black-50">Memo Reference</div>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="form-control mb-3"
                    autoComplete="off"
                    readOnly={true}
                    //onChange={handleFormChangeNumbers}
                    maxLength={16}
                    placeholder="BankName"
                    value={oppNumber}
                  //value={selectedCreditCard.cardNumber}
                  //isInvalid={!!errors.cardNumber}
                  />
                  {/* <Form.Control.Feedback type="invalid">
                {errors.cardCvv}
              </Form.Control.Feedback> */}
                </div>
              </div>
            </div>
            <div className="card-form__row">
              <div className="card-form__col">
                <div className="text-end gap-2">
                  <Button variant="secondary" className='btn-sm me-3'
                    //onClick={handleCloseModal}
                    onClick={handlewireClose}
                  >
                    Close
                  </Button>
                  <Button variant="primary" size="sm"
                    onClick={handleEmailConfirmAction}
                  >
                    Email Instructions
                  </Button>{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
    <Modal show={emailConfirmation} onHide={handleemailClose} centered>
      {/* <Modal.Header >
        <Modal.Title className='fw-bold h6'><i className="fa fa-exclamation-triangle text-warning me-3" aria-hidden="true"></i>Remove</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>An email with instructions for wire transfer has been send to {mailId}</Modal.Body>
      <Modal.Footer className='pt-0 border-top-0'>
        <Button variant="secondary" size="sm" onClick={handleemailClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </div>

  );

}

export default StripeCardList;