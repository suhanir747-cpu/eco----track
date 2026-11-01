
/* ECO TRACK — Interactive JavaScript
   Dashboard values and charts are illustrative demo content,
   not live climate feeds.
*/

document.addEventListener('DOMContentLoaded', () => {

  // Basic helper functions
  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];

  const toast = $('#toast');
  let toastTimer;

  // Notification message
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }


  // 1. MOBILE NAVIGATION

  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');

  menuToggle?.addEventListener('click', () => {

    if (!mainNav) return;

    const isOpen = mainNav.classList.toggle('open');

    menuToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    menuToggle.textContent = isOpen ? '✕' : '☰';

  });

  $$('.nav-link').forEach(link => {

    link.addEventListener('click', () => {

      mainNav?.classList.remove('open');

      menuToggle?.setAttribute(
        'aria-expanded',
        'false'
      );

      if (menuToggle) {
        menuToggle.textContent = '☰';
      }

    });

  });


  // 2. SCROLL PROGRESS BAR AND BACK TO TOP

  const progress = $('#scrollProgress');
  const backTop = $('#backToTop');

  const updateScroll = () => {

    const scrollable =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percent = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    if (progress) {
      progress.style.width = `${percent}%`;
    }

    backTop?.classList.toggle(
      'visible',
      window.scrollY > 650
    );

  };

  window.addEventListener(
    'scroll',
    updateScroll,
    { passive: true }
  );

  updateScroll();

  backTop?.addEventListener('click', () => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });


  // 3. REVEAL ANIMATIONS

  const revealTargets = $$(
    '.section-heading, .metric-card, .track-card, ' +
    '.tech-card, .photo-card, .team-card, .glass-card'
  );

  revealTargets.forEach(element => {
    element.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {

    const revealObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible');

            revealObserver.unobserve(entry.target);

          }

        });

      },
      { threshold: 0.12 }
    );

    revealTargets.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealTargets.forEach(element => {
      element.classList.add('is-visible');
    });

  }


  // 4. ACTIVE NAVIGATION LINK

  const sections = $$('main section[id]');

  if ('IntersectionObserver' in window) {

    const sectionObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            const targetId = entry.target.id;

            $$('.nav-link').forEach(link => {

              const href = link.getAttribute('href');

              link.classList.toggle(
                'active',
                href === `#${targetId}` ||
                (targetId === 'temperature' &&
                  href === '#tracking') ||
                (targetId === 'technology' &&
                  href === '#technology')
              );

            });

          }

        });

      },
      {
        rootMargin: '-30% 0px -60% 0px'
      }
    );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

  }


  // 5. CLIMATE CHART DATA
  // These are illustrative example values.

  const chartLabels = [
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025'
  ];

  const chartValues = [
    0.82,
    0.91,
    0.88,
    1.02,
    1.10,
    1.06,
    1.18,
    1.31,
    1.38,
    1.45
  ];


  // Chart appearance settings

  const chartDefaults = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      },

      tooltip: {

        backgroundColor: '#06171d',

        borderColor: 'rgba(104,224,160,.35)',

        borderWidth: 1,

        titleColor: '#eaf8f0',

        bodyColor: '#a9c4b8',

        callbacks: {

          label: context =>
            ` Illustrative index: ${context.parsed.y.toFixed(2)}`

        }

      }

    },

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {
          color: '#789496',
          font: {
            size: 9
          }
        },

        border: {
          color: 'rgba(211,245,235,.12)'
        }

      },

      y: {

        grid: {
          color: 'rgba(211,245,235,.08)'
        },

        ticks: {
          color: '#789496',
          font: {
            size: 9
          }
        },

        border: {
          display: false
        }

      }

    }

  };


  // Chart gradient

  const makeGradient = (ctx, chartArea) => {

    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );

    gradient.addColorStop(
      0,
      'rgba(104,224,160,.32)'
    );

    gradient.addColorStop(
      1,
      'rgba(104,224,160,0)'
    );

    return gradient;

  };


  // Create line charts

  const createLineChart = (
    canvas,
    labels,
    values,
    fill = true
  ) => {

    if (!canvas || !window.Chart) {
      return null;
    }

    return new Chart(canvas, {

      type: 'line',

      data: {

        labels: labels,

        datasets: [{

          label: 'Illustrative temperature index',

          data: values,

          borderColor: '#68e0a0',

          backgroundColor: context => {

            return context.chart.chartArea
              ? makeGradient(
                  context.chart.ctx,
                  context.chart.chartArea
                )
              : 'rgba(104,224,160,.12)';

          },

          borderWidth: 2,

          pointRadius: 2,

          pointHoverRadius: 5,

          pointBackgroundColor: '#68e0a0',

          fill: fill,

          tension: 0.38

        }]

      },

      options: {

        ...chartDefaults,

        interaction: {
          intersect: false,
          mode: 'index'
        }

      }

    });

  };


  // Initialize charts

  const heroChart = createLineChart(
    $('#heroChart'),
    chartLabels,
    chartValues
  );

  const mainChart = createLineChart(
    $('#temperatureChart'),
    chartLabels,
    chartValues
  );

  let detailChart = createLineChart(
    $('#detailTemperatureChart'),
    chartLabels,
    chartValues
  );


  // 6. TEMPERATURE CHART FILTER

  $('#temperatureRange')?.addEventListener(
    'change',
    event => {

      if (!detailChart) return;

      const recent =
        event.target.value === 'recent';

      detailChart.data.labels = recent
        ? chartLabels.slice(-5)
        : chartLabels;

      detailChart.data.datasets[0].data = recent
        ? chartValues.slice(-5)
        : chartValues;

      detailChart.update();

    }
  );


  // 7. REFRESH DASHBOARD BUTTON

  $('#refreshDashboard')?.addEventListener(
    'click',
    event => {

      const button = event.currentTarget;

      button.disabled = true;

      button.textContent = '↻ Refreshing…';

      [
        heroChart,
        mainChart,
        detailChart
      ]
        .filter(Boolean)
        .forEach(chart => {
          chart.update('active');
        });

      setTimeout(() => {

        button.disabled = false;

        button.textContent = '↻ Refresh display';

        showToast(
          'Demo dashboard refreshed. No live data was fetched.'
        );

      }, 550);

    }
  );


  // 8. CLIMATE DATA SEARCH FILTER

  const search = $('#dataSearch');

  const tableRows = $$(
    '#climateTable tbody tr'
  );

  const tableCount = $('#tableCount');

  const emptyState = $('#emptyState');

  search?.addEventListener('input', () => {

    const term = search.value
      .trim()
      .toLowerCase();

    let visible = 0;

    tableRows.forEach(row => {

      const match = row.textContent
        .toLowerCase()
        .includes(term);

      row.hidden = !match;

      if (match) {
        visible++;
      }

    });

    if (tableCount) {

      tableCount.textContent =
        `${visible} indicator${visible === 1 ? '' : 's'}`;

    }

    if (emptyState) {

      emptyState.hidden = visible !== 0;

    }

  });


  // 9. DOWNLOAD CLIMATE DATA AS CSV

  $('#downloadCsv')?.addEventListener(
    'click',
    () => {

      const rows = [

        [
          'Indicator',
          'What is observed',
          'Technology',
          'Display type',
          'Data note'
        ],

        [
          'Temperature',
          'Long-term temperature variation',
          'Weather stations / satellites',
          'Trend chart',
          'Illustrative project content'
        ],

        [
          'CO2',
          'Atmospheric concentration',
          'Gas monitoring instruments',
          'Time series',
          'Illustrative project content'
        ],

        [
          'Sea level',
          'Ocean surface height',
          'Satellite altimetry / tide gauges',
          'Trend map',
          'Illustrative project content'
        ],

        [
          'Forest cover',
          'Land-cover change',
          'Remote sensing / GIS',
          'Image comparison',
          'Illustrative project content'
        ],

        [
          'Ice cover',
          'Glacier and polar ice extent',
          'Satellite imagery',
          'Area comparison',
          'Illustrative project content'
        ],

        [
          'Air quality',
          'Selected atmospheric pollutants',
          'Air-quality sensors',
          'Indicator panel',
          'Illustrative project content'
        ]

      ];

      const csv = rows
        .map(row =>
          row.map(value =>
            `"${String(value).replaceAll('"', '""')}"`
          ).join(',')
        )
        .join('\r\n');

      const blob = new Blob(
        [csv],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = URL.createObjectURL(blob);

      const anchor = document.createElement('a');

      anchor.href = url;

      anchor.download =
        'eco-track-sample-climate-data.csv';

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);

      showToast('Sample CSV downloaded.');

    }
  );


  // 10. INTERACTIVE ACTIVITY SLIDER

  const activityRange = $('#activityRange');

  const activityValue = $('#activityValue');

  const footprintScore = $('#footprintScore');

  const footprintMeter = $('#footprintMeter');

  const footprintMessage = $('#footprintMessage');


  const updateFootprint = () => {

    if (!activityRange) return;

    const value = Number(activityRange.value);

    const score = value * 10;

    if (activityValue) {

      activityValue.textContent = `${value} / 10`;

    }

    if (footprintScore) {

      footprintScore.textContent = String(score);

    }

    if (footprintMeter) {

      footprintMeter.style.width = `${score}%`;

    }

    if (footprintMessage) {

      footprintMessage.textContent =
        value <= 3
          ? 'Lower example activity setting'
          : value <= 7
            ? 'A mid-range example setting'
            : 'Higher example activity setting';

    }

  };


  activityRange?.addEventListener(
    'input',
    updateFootprint
  );

  updateFootprint();


  // 11. AUTOMATIC FOOTER YEAR

  const year = $('#year');

  if (year) {

    year.textContent = new Date().getFullYear();

  }


  // 12. PLACEHOLDER LINKS

  $$('a[href="#"]').forEach(link => {

    link.addEventListener('click', event => {

      event.preventDefault();

      showToast(
        'This section is a demonstration feature.'
      );

    });

  });

});
