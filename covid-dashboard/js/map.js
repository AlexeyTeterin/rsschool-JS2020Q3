/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
export default function setMap(res) {
  const request = new XMLHttpRequest();
  request.open('GET', './assets/json/countries.json');
  request.onload = () => {
    const collection = JSON.parse(request.responseText);

    const map = L.map('mapid').setView([40, 20], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/pavlovalisa/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      minZoom: 2,
      id: 'ckipuyrx61npy17nqq9rtqsd7',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicGF2bG92YWxpc2EiLCJhIjoiY2tpcHUxaW1pMXB6cTJ4cGtmcmo1dzVtYSJ9.Wyer4Fg3gii60yxTn2cdOw',
    }).addTo(map);
    const southWest = L.latLng(-60, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    /// events and countries layout

    const info = L.control();
    const clickedCountry = { target: null, name: '' };
    const maxStat = {};
    const infoType = { type: 'TotalConfirmed', absolute: true };

    function setMaxStat(key) {
      let max = 0;
      let maxPer100 = 0;

      res.Countries.forEach((country) => {
        const pop = country.Premium.CountryStats.Population / 100000;
        if (max < country[key]) max = country[key];
        if (maxPer100 < (country[key] / pop)) maxPer100 = country[key] / pop;
      });

      maxStat[key] = max / 5;
      maxStat[`${key}Per100`] = maxPer100 / 5;
    }
    const keysArr = ['NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered'];
    const labelsArr = ['New Confirmed', 'Total Confirmed', 'New Deaths', 'Total Deaths', 'New Recovered', 'Total Recovered'];
    keysArr.forEach((a) => setMaxStat(a));
    info.onAdd = function add() {
      this.div = L.DomUtil.create('div', 'info');
      this.update();
      return this.div;
    };

    info.update = function update(e) {
      let country = false;
      if (e) country = res.Countries.find((c) => c.Country === e.name);
      let stats = country ? country[infoType.type] : 'no information';
      if (!infoType.absolute && country) {
        stats = (stats / (country.Premium.CountryStats.Population / 100000)).toFixed(2);
      }
      this.div.innerHTML = `<b>Covid statistics</b><br/>${e
        ? `<b>${e.name}</b><br/>${labelsArr[keysArr.indexOf(infoType.type)]} ${infoType.absolute ? '' : 'per 100k'}:<br/> ${stats}`
        : 'Hover over a country'}`;
    };

    info.addTo(map);

    let geoJson;

    function getColor(name) {
      const country = res.Countries.find((c) => c.Country === name);
      if (!country) { return ''; }
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
      ];
      const per100 = infoType.absolute ? 1 : country.Premium.CountryStats.Population / 100000;
      const stat = infoType.absolute ? maxStat[infoType.type] : maxStat[`${infoType.type}Per100`];
      const k = country[infoType.type] / per100;
      let level = stat / 8;
      if (level > 1000) level = Math.round(level / 1000) * 1000;
      else level = level.toFixed(3);
      let a = Math.floor((stat - k) / level);
      a = a > 7 ? 7 : a;
      return colors[a < 0 ? 0 : a];
    }

    function setColors() {
      Object.keys(geoJson._layers).forEach((key) => {
        geoJson._layers[key].options
          .fillColor = getColor(geoJson._layers[key].feature.properties.name);
        geoJson._layers[key].setStyle({});
      });

      const label = document.querySelector('#mapid > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div.info.legend.leaflet-control');
      label.innerHTML = '';
      let level = maxStat[`${infoType.type}${infoType.absolute ? '' : 'Per100'}`] / 8;
      if (level > 1000) level = Math.round(level / 1000) * 1000;
      else level = level.toFixed(3);
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
      ];
      colors.reverse().forEach((color, i) => {
        label.innerHTML += `<i style="background:${color}"></i> ${Math.round(level * i * 1000) / 1000}${colors[i + 1] ? `&ndash;${Math.round(level * (i + 1) * 1000) / 1000}<br>` : '+'}`;
      });
    }

    function setLabel(e) {
      if (e.value) {
        if (infoType === e.value.replace('Per100k', '') && (!infoType.absolute === e.value.includes('Per100k'))) return;
        infoType.absolute = !e.value.includes('Per100k');
        infoType.type = e.value.replace('Per100k', '');
        setColors();
      }
    }
    document.querySelector('#list__indicator').addEventListener('click', (e) => setLabel(e.target));
    document.querySelector('.row-title-count').addEventListener('click', () => setLabel(document.querySelector('#list__indicator')));
    document.querySelector('.row-title-abs').addEventListener('click', () => setLabel(document.querySelector('#list__indicator')));

    document.querySelector('.list').addEventListener('click', (e) => {
      if (!e.path[1].dataset.Country) return;
      const clickedListName = res.Countries
        .find((a) => a.Country === e.path[1].dataset.Country).Country;
      if (clickedCountry.target) geoJson.resetStyle(clickedCountry.target);
      if (clickedListName === clickedCountry.name) {
        clickedCountry.name = '';
        clickedCountry.target = null;
        return;
      }
      const target = geoJson._layers[Object.keys(geoJson._layers)
        .find((key) => geoJson._layers[key].feature.properties.name === clickedListName)];
      if (!target) return;
      clickedCountry.name = clickedListName;
      clickedCountry.target = target;
      target.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.5,
      });
    });

    document.querySelector('.map-wrapper > .max-min-btn').addEventListener('click', () => setTimeout(() => map.invalidateSize(true), 250));

    function handleClick(e) {
      const { name } = e.target.feature.properties;
      if (res.Countries.find((a) => a.Country === name)) {
        const clickEvent = new Event('click', { bubbles: true });
        const targetRow = Array.from(document.querySelectorAll('.list__row'))
          .filter((row) => row.firstChild.textContent === name)[0];
        if (targetRow) {
          targetRow.firstChild.dispatchEvent(clickEvent);
        }
      }
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.name),
        weight: 1,
        opacity: 1,
        color: '',
        dashArray: '3',
        dashOpacity: 0.1,
        fillOpacity: 0.3,
      };
    }

    function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.5,
      });
      info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
      if (clickedCountry.target !== e.target) {
        geoJson.resetStyle(e.target);
      }
      info.update();
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: handleClick,
      });
    }
    geoJson = L.geoJson(collection, {
      style,
      onEachFeature,
    }).addTo(map);
    // legend

    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function add() {
      const key = 'TotalConfirmed';
      const div = L.DomUtil.create('div', 'info legend');
      let level = Math.round(maxStat[key] / 8);
      if (level > 1000) level = Math.round(level / 1000) * 1000;
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
      ];
      colors.reverse().forEach((color, i) => {
        div.innerHTML += `<i style="background:${color}"></i> ${level * i}${colors[i + 1] ? `&ndash;${level * (i + 1)}<br>` : '+'}`;
      });
      return div;
    };

    legend.addTo(map);
  };

  request.send();
}
