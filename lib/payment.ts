declare global {
  interface Window {
    paypal: any;
  }
}

export async function initializePayPalButton(
  containerRef: HTMLDivElement,
  amount: number,
  merchantEmail: string,
  onSuccess: (details: any) => void
) {
  const button = await window.paypal.Buttons({
    createOrder: (_: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: amount.toString(),
            currency_code: 'USD'
          },
          payee: {
            email_address: merchantEmail
          }
        }]
      });
    },
    onApprove: async (_: any, actions: any) => {
      const details = await actions.order.capture();
      onSuccess(details);
    }
  });

  button.render(containerRef);
}
