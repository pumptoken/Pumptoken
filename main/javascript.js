@@ -1,41 +1,58 @@
 -var accounts;
 -var account;
 +var accounts, pump;
  
 -function setStatus(message) {
 -  var status = document.getElementById("status");
 -  status.innerHTML = message;
 +function registeruser() {
 +    var from = document.getElementById('accounts').value;
 +    var song = document.getElementById('regId').value;
 +    var price = document.getElementById('regPrice').value;
 +    var artist = document.getElementById('registerName').value;
 +    //var beat = BeatCoin.deployed();
 +    pump.registeruser.call(insure, price, accounts[user], {from: accounts[from]}).then(function () {
 +      console.log('Song Registered!');
 +    })
 +    .catch(e => {
 +      console.log(e);
 +    });
 +    updateBalances();
  };
  
 -function refreshBalance() {
 -  var meta = pumpCoin.deployed();
 -
 -  meta.getBalance.call(account, {from: account}).then(function(value) {
 -    var balance_element = document.getElementById("balance");
 -    balance_element.innerHTML = value.valueOf();
 -  }).catch(function(e) {
 -    console.log(e);
 -    setStatus("Error getting balance; see log.");
 -  });
 +function purchaseuser() {
 +    var from = document.getElementById('accounts').value;
 +    var song = document.getElementById('purId').value;
 +    var price = document.getElementById('purPrice').value;
 +    var artist = document.getElementById('purchaseName').value;
 +    beat.purchaseSong.call(song, price, accounts[user], {from: accounts[from]}).then(function () {
 +      console.log('Song Purchased!');
 +    })
 +    .catch(e => {
 +      console.log(e);
 +    });
 +    updateBalances();
  };
  
 -function sendCoin() {
 -  var meta = pumpCoin.deployed();
 -
 -  var amount = parseInt(document.getElementById("amount").value);
 -  var receiver = document.getElementById("receiver").value;
 -
 -  setStatus("Initiating transaction... (please wait)");
 -
 -  meta.sendCoin(receiver, amount, {from: account}).then(function() {
 -    setStatus("Transaction complete!");
 -    refreshBalance();
 -  }).catch(function(e) {
 -    console.log(e);
 -    setStatus("Error sending coin; see log.");
 +function addBalance(index) {
 +  beat.createTokens.sendTransaction(web3.eth.accounts[index],{from: web3.eth.coinbase, value:1});
 +  beat.balanceOf.call(accounts[index]).then(bal => {
 +    console.log("Added to balance");
    });
 -};
 +  updateBalances();
 +}
 +
 +function updateBalances() {
 +  for(var i=0; i < accounts.length; i++) {
 +    (i => {
 +      beat.balanceOf.call(accounts[i]).then(bal => {
 +        document.getElementById(i+'bal').innerHTML = bal + ' BEA';
 +        console.log('Updated balance ' + i);
 +      });
 +    })(i);
 +  }
 +  beat.totalSupply.call().then(val => {
 +    document.getElementById('supply').innerHTML = val;
 +  })
 +}
  
  window.onload = function() {
 +  beat = BeatCoin.deployed();
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
 @@ -48,8 +65,34 @@ window.onload = function() {
      }
  
      accounts = accs;
 -    account = accounts[0];
 +    var fromAccounts = document.getElementById('accounts');
 +    var regAccounts = document.getElementById('registerName');
 +    var purAccounts = document.getElementById('purchaseName');
 +
 +    var addButton = document.createElement('input');
 +    addButton.type = 'button';
 +    addButton.class = 'addButton';
 +    addButton.value = "+";
 +
 +
 +    for(var i=0; i < accounts.length; i++) {
 +      //Add options to address select elements
 +      var opt = document.createElement('option');
 +      opt.value = i;
 +      opt.innerHTML = i + ": " + accounts[i];
 +      fromAccounts.appendChild(opt);
 +      regAccounts.appendChild(opt.cloneNode(true));
 +      purAccounts.appendChild(opt.cloneNode(true));
  
 -    refreshBalance();
 +      //Add cell to balances table
 +      var balTable = document.getElementById('balances');
 +      var cell = document.createElement('tr').cloneNode(true);
 +      cell.innerHTML = '<td id='+i+'>'+accounts[i]+'</td>'
 +                      +'<td id='+i+'bal>0 BEA</td>'
 +                      +'<td><input type="button" value="+" onclick="addBalance('+i+')" /></td>';
 +      balTable.appendChild(cell);
 +    }
 +
 +    updateBalances();
    });
 -}
 +};
