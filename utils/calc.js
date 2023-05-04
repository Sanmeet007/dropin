const billAmountCalculator = (x) => {
  let serviceCharge = (x / 100) * 10;
  if (serviceCharge > 100) serviceCharge = 100;
  return x + serviceCharge;
};

module.exports = { billAmountCalculator };
