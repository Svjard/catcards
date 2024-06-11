import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';

let equipment = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
  await page.goto('https://www.cat.com/en_US/products/new/equipment.html');

  await page.waitForSelector('.cards-wrap');

  const hrefs = await page.evaluate(() => {
    const anchors = document.querySelectorAll('.card > a');
    return [].map.call(anchors, a => a.href);
  });

  for (let i = 0; i < hrefs.length; i++) {
    await page.goto(hrefs[i]);
    await page.waitForSelector('.card-wrapper');

    const equipmentLinks = await page.evaluate(() => {
      const anchors = document.querySelectorAll('.card-footer > a.button-primary');
      return [].map.call(anchors, a => a.href);
    }); 
    
    for (let j = 0; j < equipmentLinks.length; j++) {
      console.log('visiting', equipmentLinks[j])
      await page.goto(equipmentLinks[j]);
      
      await page.waitForSelector('.img-container');

      equipment.push({
        directLink: equipmentLinks[j]
      });

      const imgs = await page.$$eval('img.img-container[src]', imgs => imgs.map(img => img.getAttribute('src')));
      equipment[equipment.length - 1].image = imgs[0];

      let el = await page.$('.inner-wrap h1 span:first-child');
      let category = await page.evaluate(e => e.textContent, el);

      el = await page.$('.inner-wrap h1');
      let name = await page.evaluate(e => e.textContent, el);
      name = name.trim().replace(category, '').trim();

      equipment[equipment.length - 1].category = category;
      equipment[equipment.length - 1].name = name;

      equipment[equipment.length - 1].keySpecs = [];
      const keySpecs = await page.$$eval('.top-three dt', options => {
        return options.map(option => option.textContent);
      });

      const keySpecsUS = await page.$$eval('.top-three .unit-us', options => {
        return options.map(option => option.textContent);
      });

      const keySpecsMetric = await page.$$eval('.top-three .unit-metric', options => {
        return options.map(option => option.textContent);
      });

      keySpecs.forEach((item, x) => {
        equipment[equipment.length - 1].keySpecs.push({
          label: item.trim(),
          us: keySpecsUS[x].trim(),
          metric: keySpecsMetric[x].trim()
        });
      });

      const headings = await page.$$eval('article.accordion__item .accordion__heading', headings => {
        return headings.map(option => option.textContent);
      });

      const result = await page.$$eval('.accordion__body', tables => {
        return Array.from(tables, table => {
          const rows = table.querySelectorAll('tr');
          return Array.from(rows, row => {
            const columns = row.querySelectorAll('strong, span');
            return Array.from(columns, column => column.textContent);
          });
        });
      });
      
      equipment[equipment.length - 1].specifications = [];

      headings.forEach((h, x) => {
        result[x].forEach((r) => {
          if (r[0].trim() !== 'Note') {
            equipment[equipment.length - 1].specifications.push({
              category: h.trim(),
              label: r[0].trim(),
              us: r[1].trim(),
              metric: r[2].trim()
            });
          }
        });
      });

    }
  }

  writeFileSync('data/equipment.json', JSON.stringify(equipment, null, 2));
  await browser.close();
})();
