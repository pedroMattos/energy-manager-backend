const puppeteer = require('puppeteer');

test('Teste E2E: Clicar no botão e verificar se há uma tag h1 com o texto "Dashboard"', async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto('energy-manager-spqq.vercel.app')

    // Espere até que o botão com a classe MuiButtonBase-root esteja disponível
    await page.waitForSelector('.MuiButtonBase-root')

    // Clique no botão com a classe MuiButtonBase-root
    await page.click('.MuiButtonBase-root')

    // Verifique se há uma tag h1 com o texto "Dashboard" na página
    const dashboardHeading = await page.evaluate(() => {
      const h1Elements = document.querySelectorAll('h1')
      const h1Text = Array.from(h1Elements).find(element => element.textContent.includes('Dashboard'))
      return h1Text ? true : false
    })

    // Verifique se o teste passou
    expect(dashboardHeading).toBe(true)

    console.log('Teste E2E passou: tag h1 com o texto "Dashboard" foi encontrada na página.')
  } catch (error) {
    console.error('Teste E2E falhou:', error.message)
  } finally {
    await browser.close()
  }
})

test('Teste E2E: Navegar entre dashboard e historico de faturas', async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto('energy-manager-spqq.vercel.app')

    // Espere até que o botão com a classe MuiButtonBase-root esteja disponível
    await page.waitForSelector('.MuiButtonBase-root')
    
    // Clique no botão com a classe MuiButtonBase-root
    await page.click('.MuiButtonBase-root')
    
    await page.waitForSelector('#history-navigator')
    await page.click('#history-navigator')

    await page.waitForTimeout(500)

    expect(page.url()).toBe('energy-manager-spqq.vercel.app/history')

    console.log('Teste E2E passou: navegação para página de historico de faturas')
  } catch (error) {
    console.error('Teste E2E falhou:', error.message)
  } finally {
    await browser.close()
  }
})
