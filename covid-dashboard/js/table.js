import { getSummary } from './CovidData.js';
import { list } from './list.js';
import setMap from './map.js';

const divDeaths = document.querySelector('.table-deaths');
const divRecovered = document.querySelector('.table-recovered');
const divCases = document.querySelector('.table-cases');
export const buttonCount = document.querySelector('.row-title-count');
export const buttonAbs = document.querySelector('.row-title-abs');
const buttonArea = document.querySelector('.row-title-area');

getSummary()
  .then((res) => {
    const worldPopulation = 7827000000;
    // default settings
    document.querySelector('.day-updated').innerText = `${res.Date.slice(11, 16)} ${res.Date.slice(0, 10)}`;
    let population = worldPopulation;
    let source = res.Global;
    const stat = { world: true, total: true, absolute: true };
    let con = source.TotalConfirmed;
    let deat = source.TotalDeaths;
    let rec = source.TotalRecovered;

    function round(n) {
      return Math.round(n * 100) / 100;
    }

    function setStat() {
      if (!source) {
        divCases.innerText = 'no info';
        divDeaths.innerText = 'no info';
        divRecovered.innerText = 'no info';
        return;
      }
      let k = 1;
      if (!stat.absolute) {
        k = population / 100000;
      }
      if (stat.total) {
        con = source.TotalConfirmed;
        deat = source.TotalDeaths;
        rec = source.TotalRecovered;
      } else {
        con = source.NewConfirmed;
        deat = source.NewDeaths;
        rec = source.NewRecovered;
      }
      divCases.innerText = round(con / k);
      divDeaths.innerText = round(deat / k);
      divRecovered.innerText = round(rec / k);
    }
    function toggleTotal() {
      stat.total = !stat.total;
      buttonCount.innerText = stat.total ? 'Total' : 'New';
      buttonCount.classList.toggle('total');
      buttonCount.classList.toggle('new');
      setStat();
    }
    function toggleAbs() {
      stat.absolute = !stat.absolute;
      buttonAbs.innerText = stat.absolute ? 'Absolute' : 'Per 100k';
      buttonAbs.classList.toggle('absolute');
      buttonAbs.classList.toggle('relative');
      setStat();
    }
    buttonCount.addEventListener('click', () => toggleTotal());
    buttonAbs.addEventListener('click', () => toggleAbs());

    buttonArea.addEventListener('click', async () => {
      buttonArea.innerText = 'World';
      population = worldPopulation;
      source = res.Global;
      await setStat();

      const activeListRow = document.querySelector('.list__row_active');
      const click = new Event('click', { bubbles: true });
      if (activeListRow) activeListRow.firstChild.dispatchEvent(click);
    });

    list.addEventListener('click', (e) => {
      if (e.target.value) {
        if (stat.absolute === (e.target.value[e.target.value.length - 1] === 'k')) toggleAbs();
        if (stat.total === (e.target.value.slice(0, 3) !== 'Tot')) toggleTotal();
        setStat();
      }

      if (!e.path[1].dataset.Country) return;
      source = res.Countries.find((a) => a.CountryCode === e.path[1].dataset.CountryCode);
      buttonArea.innerText = source.Country;
      population = source.Premium.CountryStats.Population;
      setStat();
    });

    document.querySelector('.map').addEventListener('click', () => {
      function setSource() {
        source = res.Countries.find((a) => a.Country === buttonArea.innerText);
        if (source) population = source.Premium.CountryStats.Population;
        if (!source) {
          source = res.Global;
          population = worldPopulation;
        }
        setStat();
      }
      setTimeout(setSource, 10);
    });

    setStat();
    setMap(res, setStat());
  });
