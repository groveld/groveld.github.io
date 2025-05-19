const formatEmailBody = (name, email, subject, message, domain) => {
  return `
    <b>${name}</b><br>
    ${email}<br><br>
    <b>${subject}</b><br><br>
    ${message}<br><br>
    --&nbsp;<br>
    <i>Dit bericht is verzonden via het contactformulier op ${domain}</i>
  `;
};

export const onRequestPost = async (context) => {
  try {
    return await handleRequest(context);
  } catch (err) {
    return jsonResponse("Er is iets misgegaan", 500);
  }
};

const sanitizeInput = (input) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "\n": "<br>",
  };

  return String(input).replace(/[&<>"'\n]/g, (m) => map[m]);
};

const jsonResponse = (message, status = 200) => {
  const success = status >= 200 && status < 300;
  return new Response(JSON.stringify({ success, message }), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
};

const handleRequest = async ({ request, env }) => {
  let formData = await request.formData();
  let sanitizedData = new FormData();

  for (let [key, value] of formData.entries()) {
    sanitizedData.append(key, sanitizeInput(value));
  }

  // Check if honeypot field is filled
  let phone = sanitizedData.get("phone");
  if (phone && phone.trim() !== "") {
    return jsonResponse("Spam gedetecteerd", 400);
  }

  let name = sanitizedData.get("name");
  let email = sanitizedData.get("email");
  let subject = sanitizedData.get("subject");
  let message = sanitizedData.get("message");
  let domain = request.headers.get("Host");
  let token = sanitizedData.get("cf-turnstile-response");
  let ip = request.headers.get("CF-Connecting-IP");

  if (!name || !email || !subject || !message) {
    return jsonResponse("Ontbrekende verplichte velden", 400);
  }

  const isTokenValid = await validateToken(env, token, ip);
  if (!isTokenValid.success) {
    return jsonResponse("Ongeldige token", 403);
  }

  const emailResponse = await sendEmailWithMailgun(
    env,
    name,
    email,
    subject,
    message,
    domain
  );
  if (!emailResponse.success) {
    return jsonResponse("Fout bij verzenden", 500);
  }

  return jsonResponse("Bericht succesvol verzonden", 200);
};

const sendRequest = async (url, options) => {
  const response = await fetch(url, options);
  return { success: response.ok, status: response.status };
};

const validateToken = async (env, token, ip) => {
  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const options = {
    method: "POST",
    body: formData,
  };

  const response = await sendRequest(url, options);
  return response;
};

const sendEmailWithMailgun = async (
  env,
  name,
  email,
  subject,
  message,
  domain
) => {
  const formData = new FormData();
  formData.append(
    "from",
    env.MAILGUN_FROM_NAME + " <" + env.MAILGUN_FROM_EMAIL + ">"
  );
  formData.append(
    "h:Sender",
    env.MAILGUN_FROM_NAME + " <" + env.MAILGUN_FROM_EMAIL + ">"
  );
  formData.append(
    "to",
    env.MAILGUN_TO_NAME + " <" + env.MAILGUN_TO_EMAIL + ">"
  );
  formData.append("h:Reply-To", name + " <" + email + ">");
  formData.append("subject", name + " - " + subject);
  formData.append(
    "html",
    formatEmailBody(name, email, subject, message, domain)
  );

  const url = env.MAILGUN_API_URI;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
    },
    body: formData,
  };

  const response = await sendRequest(url, options);
  return response;
};

const sendEmailWithSendGrid = async (
  env,
  name,
  email,
  subject,
  message,
  domain
) => {
  const url = env.SENDGRID_API_URI;
  const body = JSON.stringify({
    personalizations: [
      {
        to: [{ email: env.SENDGRID_TO_EMAIL, name: env.SENDGRID_TO_NAME }],
        subject: `${name} - ${subject}`,
      },
    ],
    from: { email: env.SENDGRID_FROM_EMAIL, name: env.SENDGRID_FROM_NAME },
    reply_to: { email: email, name: name },
    content: [
      {
        type: "text/html",
        value: formatEmailBody(name, email, subject, message, domain),
      },
    ],
  });

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body,
  };

  const response = await sendRequest(url, options);
  return response;
};
