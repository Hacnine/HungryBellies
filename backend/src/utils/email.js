import nodemailer from "nodemailer"

// Configure your email service here
// This example uses Gmail - update with your email provider
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

async function sendOrderConfirmationEmail(email, name, order) {
  try {
    const itemsList = order.items
      .map((item) => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
      .join("\n")

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation - #${order.id.slice(0, 8)}`,
      html: `
        <h2>Order Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for your order. Here are your order details:</p>
        
        <h3>Order ID: ${order.id.slice(0, 8)}</h3>
        
        <h3>Items:</h3>
        <pre>${itemsList}</pre>
        
        <h3>Order Total: $${order.total.toFixed(2)}</h3>
        
        <p>Your order is being prepared and will be on its way soon!</p>
        
        <p>Track your order: [Your app URL]/order/${order.id}</p>
        
        <p>Thank you!</p>
        <p>Food Delivery Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Confirmation email sent to ${email}`)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

async function sendOrderShippedEmail(email, name, orderId) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Order is Out for Delivery - #${orderId.slice(0, 8)}`,
      html: `
        <h2>Out for Delivery!</h2>
        <p>Hi ${name},</p>
        <p>Your order #${orderId.slice(0, 8)} is on its way!</p>
        <p>Track your order: [Your app URL]/order/${orderId}</p>
        <p>Thank you!</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Shipped email sent to ${email}`)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

export { sendOrderConfirmationEmail, sendOrderShippedEmail }
