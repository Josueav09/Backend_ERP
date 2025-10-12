// backend/services/auth-service/src/email/templates/verification-email.templates.ts

export function getVerificationCodeEmailHTML(code: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Código de Verificación - Growvia</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .mobile-padding {
        padding: 20px !important;
      }
      .code-box {
        padding: 30px 20px !important;
      }
      .logo-img {
        width: 180px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F5F5F5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(1, 57, 54, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #013936 0%, #015550 100%); padding: 40px 40px 50px; text-align: center;">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FGXYgRU51M5hPiYoVulYlCNzdSezYW.png" alt="Growvia" class="logo-img" style="width: 220px; height: auto; margin-bottom: 20px;" />
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #C7E196 0%, rgba(199, 225, 150, 0.3) 100%); margin: 0 auto; border-radius: 2px;"></div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="mobile-padding" style="padding: 50px 60px; background-color: #FFFFFF;">
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 30px;">
                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #013936;">
                      Verifica tu cuenta
                    </h1>
                    <p style="margin: 0; font-size: 16px; color: #A4B0AC;">
                      Usa el siguiente código para completar tu inicio de sesión
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Verification Code Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 30px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td class="code-box" style="background: linear-gradient(135deg, #F8FDF0 0%, #F0F9E8 100%); border: 2px solid #C7E196; border-radius: 12px; padding: 40px; text-align: center;">
                          <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #013936; text-transform: uppercase; letter-spacing: 1px;">
                            Tu código de verificación
                          </p>
                          <div style="font-size: 42px; font-weight: 700; color: #013936; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${code}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-top: 20px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #013936;">
                      Este código expirará en <strong>5 minutos</strong>
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #A4B0AC;">
                      Si no solicitaste este código, puedes ignorar este mensaje
                    </p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 40px 0 30px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #C7E196 50%, transparent 100%);"></div>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #A4B0AC;">
                      ¿Necesitas ayuda? Contáctanos en 
                      <a href="mailto:informes@growvia.global" style="color: #013936; text-decoration: none; font-weight: 600;">informes@growvia.global</a>
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #013936; padding: 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FGXYgRU51M5hPiYoVulYlCNzdSezYW.png" alt="Growvia" style="width: 140px; height: auto;" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0 0 20px; font-size: 12px; color: #C7E196; line-height: 18px;">
                      Te ofrecemos acceso a un equipo de vendedores de élite, listos para generar resultados desde el primer día.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; border-top: 1px solid rgba(199, 225, 150, 0.2);">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #FFFFFF; font-weight: 600;">CONTÁCTANOS</p>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #C7E196;">
                      <strong>Oficina:</strong> Vía Central 125, Real Ocho, San Isidro, Lima, Perú
                    </p>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #C7E196;">
                      <strong>Teléfono:</strong> +51 1 789-4561
                    </p>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #C7E196;">
                      <strong>WhatsApp:</strong> +51 987 654 321
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #C7E196;">
                      <strong>Correo:</strong> <a href="mailto:informes@growvia.global" style="color: #C7E196; text-decoration: none;">informes@growvia.global</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 10px; border-top: 1px solid rgba(199, 225, 150, 0.2);">
                    <p style="margin: 0; font-size: 11px; color: #A4B0AC;">
                      © 2025 Growvia S.A.C. - Todos los derechos reservados
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getVerificationCodeEmailText(code: string): string {
  return `
GROWVIA - Código de Verificación

Tu código de verificación es: ${code}

Este código expirará en 5 minutos.

Si no solicitaste este código, puedes ignorar este mensaje.

¿Necesitas ayuda? Contáctanos en informes@growvia.global

---
Growvia S.A.C.
Oficina: Vía Central 125, Real Ocho, San Isidro, Lima, Perú
Teléfono: +51 1 789-4561
WhatsApp: +51 987 654 321
Correo: informes@growvia.global

© 2025 Growvia S.A.C. - Todos los derechos reservados
  `.trim();
}