let modal = document.querySelector(".modal");
let exitBtn = document.querySelector(".exit");
let addNewInvoice = document.querySelector(".new-invoice");
let invoiceDetails = document.querySelector(".invoice-sec-extra");
let invoiceSection = document.querySelector(".invoice-sec");
let invoiceListContainer = document.querySelector(".invoice-list");
let addNewItem = document.querySelector(".newItem");
let itemList = document.querySelector(".itemList");
let invoiceForm = document.querySelector("#invoiceForm");
let invoiceInfo = document.querySelector(".info");
let errorMsg = document.querySelector(".error-msg");
let editModal = document.querySelector(".e-modal");
let editExitBtn = document.querySelector(".e-exit");
let editInvoiceForm = document.querySelector("#edit-invoiceForm");
let removeItemBtn = document.querySelector("#removeItem");

modal.style.display = "none";
invoiceDetails.style.display = "none";
itemList.style.display = "none";
errorMsg.style.display = "none";
editModal.style.display = "none";

exitBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

editExitBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

addNewInvoice.addEventListener("click", () => {
  modal.style.display = "flex";
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".go-back")) {
    invoiceDetails.style.display = "none";
    invoiceSection.style.display = "block";
  }
});

addNewItem.addEventListener("click", () => {
  itemList.style.display = "grid";
});

removeItemBtn.addEventListener("click", () => {
  const itemNameInput = document.querySelector("#itemName");
  const itemQtyInput = document.querySelector("#itemQty");
  const itemPriceInput = document.querySelector("#itemPrice");
  const itemTotalInput = document.querySelector("#itemTotal");

  itemNameInput.value = "";
  itemQtyInput.value = "";
  itemPriceInput.value = "";
  itemTotalInput.value = "";

  itemList.style.display = "none";
});
invoiceListContainer.addEventListener("click", (e) => {
  const invoiceElement = e.target.closest(".invoices");
  if (!invoiceElement) return;

  const code = invoiceElement.querySelector(".code").textContent;
  const invoice = invoices.find((e) => e.code === code);

  if (invoice) {
    showInvoiceDetail(invoice);
  }
});

function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

invoiceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let invoiceData = {
    code: generateCode(),
    streetAddress: document.querySelector("#strAddress").value,
    city: document.querySelector("#bill-from-city-input").value,
    postCode: document.querySelector("#bill-from-postCodeInput").value,
    country: document.querySelector("#bill-from-country-input").value,
    clientName: document.querySelector("#clientName").value,
    clientEmail: document.querySelector("#clientEmail").value,
    clientAddress: document.querySelector("#bill-to-strAddress").value,
    clientCity: document.querySelector("#bill-to-city-input").value,
    clientPostCode: document.querySelector("#bill-to-postCode-input").value,
    clientCountry: document.querySelector("#bill-to-country-input").value,
    invoiceDate: document.querySelector("#invoiceDate").value,
    netDays: document.querySelector("#netDays").value,
    projectDescription: document.querySelector("#projectDescription").value,
    itemName: document.querySelector("#itemName").value,
    itemQty: document.querySelector("#itemQty").value,
    itemPrice: document.querySelector("#itemPrice").value,
    itemTotal: document.querySelector("#itemTotal").value,
  };

  invoices.push(invoiceData);
  localStorage.setItem("invoices", JSON.stringify(invoices));

  invoiceSummary(invoices);
  numberOfInvoices(invoiceInfo);
  checkInvoices();
  modal.style.display = "none";
  invoiceForm.reset();
});

const showInvoiceDetail = (invoice) => {
  const statusColor =
    invoice.status === "Paid" ? "rgb(51, 214, 159)" : "rgb(255, 145, 0)";
  const statusText = invoice.status || "Pending";
  const statusBgColor =
    invoice.status === "Paid"
      ? "rgba(51, 214, 160, 0.06)"
      : "rgba(255, 145, 0, 0.06)";
  invoiceDetails.innerHTML = `
    <div class="blank"></div> 
    <div class="go-back">
      <i class="ri-arrow-left-s-fill"></i>
      <p>Go back</p>
    </div>
    <div class="controls2">
      <div class="status-container">
       <span class="status" style="background-color: ${statusBgColor}; color: ${statusColor}">
            <i class="ri-circle-fill" style="color: ${statusColor}"></i>
            <p>${statusText}</p>
          </span>
      </div>
      <div class="edit-buttons">
        <div onclick='editInvoice("${invoice.code}")' class="editBtn">Edit</div>
        <div onclick='deleteInvoice("${invoice.code}")' class="deleteBtn">Delete</div>
        <div onclick='markAsPaid("${invoice.code}")' class="markAsPaid">Mark as Paid</div>
      </div>
    </div>
    <div class="invoice-details">
      <div class="codeandloc">
        <div class="codesec">
          <div class="code"><span>#</span> ${invoice.code}</div>
          <div class="projectDesc">${invoice.projectDescription}</div>
        </div>
        <div class="locationDet">
          <div class="bill-from-streetAdress">${invoice.streetAddress}</div>
          <div class="bill-from-city">${invoice.city}</div>
          <div class="bill-from-postCode">${invoice.postCode}</div>
          <div class="bill-from-country">${invoice.country}</div>
        </div>
      </div>
      <div class="main-invoice-info">
        <div class="dates">
          <div class="invoice-date-sec">
            <p>Invoice Date</p>
            <h2 class="invoice-date">${invoice.invoiceDate}</h2>
          </div>
          <div class="payment-due-sec">
            <p>Payment Due</p>
            <h2 class="payment-due">In ${invoice.netDays}</h2>
          </div>
        </div>
        <div class="bill-to-sec">
          <p>Bill To</p>
          <h2>${invoice.clientName}</h2>
          <p>${invoice.clientAddress}</p>
          <p>${invoice.clientCity}</p>
          <p>${invoice.clientPostCode}</p>
          <p>${invoice.clientCountry}</p>
        </div>
        <div class="sent-to-sec">
          <p>Sent To</p>
          <h2>${invoice.clientEmail}</h2>
        </div>
      </div>
      <div class="item-list-sec">
        <div class="item-list-header">
          <div>Item Name</div>
          <div class="qty">QTY.</div>
          <div class="price">Price</div>
          <div class="total">Total</div>
        </div>
        <div class="item-list">
          <div class="item-name">${invoice.itemName}</div>
          <div class="item-qty">${invoice.itemQty}</div>
          <div class="item-price">${invoice.itemPrice}</div>
          <div class="item-total">${invoice.itemTotal}</div>
        </div>
      </div>
      <div class="amount-due">
        <span>Amount Due</span>
        <h2>${invoice.itemTotal}</h2>
      </div>
    </div>
  `;

  invoiceDetails.style.display = "flex";
  invoiceSection.style.display = "none";
};

const invoiceSummary = (invoices) => {
  const invoiceSummaryList = invoices.map((invoice) => {
    const statusColor =
      invoice.status === "Paid" ? "rgb(51,214,159)" : "rgb(255,143,0)";
    const statusText = invoice.status || "Pending";
    const statusBgColor =
      invoice.status === "Paid"
        ? "rgba(51, 214, 160, 0.06)"
        : "rgba(255, 145, 0, 0.06)";
    return `
      <div class="invoices">
        <div class="invoice-info">
          <div class="hash">#</div>
          <span class="code">${invoice.code}</span>
          <span class="due-date">Due ${invoice.invoiceDate}</span>
          <p class="name">${invoice.clientName}</p>
        </div>
        <div class="payment">
          <p class="amount">£ ${invoice.itemTotal}</p>
          <span class="status" style="background-color: ${statusBgColor}; color: ${statusColor}">
            <i class="ri-circle-fill" style="color: ${statusColor}"></i>
            <p>${statusText}</p>
          </span>
        </div>
      </div>
    `;
  });
  invoiceListContainer.innerHTML = invoiceSummaryList.join("");
};
const numberOfInvoices = (invoiceInfo) => {
  const invoiceCountHTML = `
    <div class="info">
      <h1>Invoices</h1>
      <p>
        There are a total of ${invoices.length} <br />
        invoices
      </p>
    </div>
  `;
  invoiceInfo.innerHTML = invoiceCountHTML;
};

const deleteInvoice = (code) => {
  if (confirm("Are you sure you want to delete this Invoice?")) {
    invoices = invoices.filter((invoice) => invoice.code !== code);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    invoiceSummary(invoices);
    numberOfInvoices(invoiceInfo);
    checkInvoices();
    invoiceDetails.style.display = "none";
    invoiceSection.style.display = "block";
  }
};

const checkInvoices = () => {
  if (invoices.length === 0) {
    console.log("There are no invoices found in local storage.");
    errorMsg.style.display = "block";
  } else {
    errorMsg.style.display = "none";
  }
};
let currentInvoiceCode = null;

const editInvoice = (code) => {
  let invoice = invoices.find((invoice) => invoice.code === code);
  if (invoice) {
    currentInvoiceCode = code; // Store the current invoice code

    document.querySelector("#e-strAddress").value = invoice.streetAddress;
    document.querySelector("#e-bill-from-city-input").value = invoice.city;
    document.querySelector("#e-bill-from-postCodeInput").value =
      invoice.postCode;
    document.querySelector("#e-bill-from-country-input").value =
      invoice.country;
    document.querySelector("#e-clientName").value = invoice.clientName;
    document.querySelector("#e-clientEmail").value = invoice.clientEmail;
    document.querySelector("#e-bill-to-strAddress").value =
      invoice.clientAddress;
    document.querySelector("#e-bill-to-city-input").value = invoice.clientCity;
    document.querySelector("#e-bill-to-postCode-input").value =
      invoice.clientPostCode;
    document.querySelector("#e-bill-to-country-input").value =
      invoice.clientCountry;
    document.querySelector("#e-invoiceDate").value = invoice.invoiceDate;
    document.querySelector("#e-netDays").value = invoice.netDays;
    document.querySelector("#e-projectDescription").value =
      invoice.projectDescription;
    document.querySelector("#e-itemName").value = invoice.itemName;
    document.querySelector("#e-itemQty").value = invoice.itemQty;
    document.querySelector("#e-itemPrice").value = invoice.itemPrice;
    document.querySelector("#e-itemTotal").value = invoice.itemTotal;

    editModal.style.display = "flex";
  } else {
    console.error("Invoice not found!");
  }
};
editInvoiceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  invoices = invoices.map((invoice) => {
    if (invoice.code === currentInvoiceCode) {
      return {
        ...invoice,
        streetAddress: document.querySelector("#e-strAddress").value,
        city: document.querySelector("#e-bill-from-city-input").value,
        postCode: document.querySelector("#e-bill-from-postCodeInput").value,
        country: document.querySelector("#e-bill-from-country-input").value,
        clientName: document.querySelector("#e-clientName").value,
        clientEmail: document.querySelector("#e-clientEmail").value,
        clientAddress: document.querySelector("#e-bill-to-strAddress").value,
        clientCity: document.querySelector("#e-bill-to-city-input").value,
        clientPostCode: document.querySelector("#e-bill-to-postCode-input")
          .value,
        clientCountry: document.querySelector("#e-bill-to-country-input").value,
        invoiceDate: document.querySelector("#e-invoiceDate").value,
        netDays: document.querySelector("#e-netDays").value,
        projectDescription: document.querySelector("#e-projectDescription")
          .value,
        itemName: document.querySelector("#e-itemName").value,
        itemQty: document.querySelector("#e-itemQty").value,
        itemPrice: document.querySelector("#e-itemPrice").value,
        itemTotal: document.querySelector("#e-itemTotal").value,
      };
    }
    return invoice;
  });

  localStorage.setItem("invoices", JSON.stringify(invoices));

  invoiceSummary(invoices);
  numberOfInvoices(invoiceInfo);
  checkInvoices();

  const updatedInvoice = invoices.find(
    (invoice) => invoice.code === currentInvoiceCode
  );
  if (updatedInvoice) {
    showInvoiceDetail(updatedInvoice);
  }

  editModal.style.display = "none";
});
const itemQtyInput = document.querySelector("#itemQty");
const itemPriceInput = document.querySelector("#itemPrice");
const itemTotalInput = document.querySelector("#itemTotal");

function updateTotal() {
  const qty = parseFloat(itemQtyInput.value) || 0;
  const price = parseFloat(itemPriceInput.value) || 0;
  const total = qty * price;
  itemTotalInput.value = total.toFixed(2);
}
const markAsPaid = (code) => {
  const invoice = invoices.find((invoice) => invoice.code === code);

  if (invoice) {
    invoice.status = "Paid";

    localStorage.setItem("invoices", JSON.stringify(invoices));

    invoiceSummary(invoices);
    numberOfInvoices(invoiceInfo);
    checkInvoices();

    if (currentInvoiceCode === code) {
      showInvoiceDetail(invoice);
    }
  }
};

itemQtyInput.addEventListener("input", updateTotal);
itemPriceInput.addEventListener("input", updateTotal);

invoiceSummary(invoices);
numberOfInvoices(invoiceInfo);
checkInvoices();
console.log(invoices);
