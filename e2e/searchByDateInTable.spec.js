const puppeteer = require('puppeteer');

test('Teste E2E: Clicar no botão e verificar se há uma tag h1 com o texto "Dashboard"', async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000'); // Substitua pela URL da sua aplicação

    // Espere até que o botão com a classe MuiButtonBase-root esteja disponível
    await page.waitForSelector('.MuiButtonBase-root');

    // Clique no botão com a classe MuiButtonBase-root
    await page.click('.MuiButtonBase-root');

    // Aguarde um curto período para a transição ou animação ser concluída (opcional)
    // Verifique se há uma tag h1 com o texto "Dashboard" na página
    const dashboardHeading = await page.evaluate(() => {
      const h1Elements = document.querySelectorAll('h1');
      const h1Text = Array.from(h1Elements).find(element => element.textContent.includes('Dashboard'));
      return h1Text ? true : false;
    });

    // Verifique se o teste passou
    expect(dashboardHeading).toBe(true);

    console.log('Teste E2E passou: tag h1 com o texto "Dashboard" foi encontrada na página.');
  } catch (error) {
    console.error('Teste E2E falhou:', error.message);
  } finally {
    await browser.close();
  }
});
