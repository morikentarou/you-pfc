# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "chart.js", to: "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.js"
pin "chartjs-plugin-datalabels", to: "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0/dist/chartjs-plugin-datalabels.js"
pin "new_goal", to: "new_goal.js"
pin "index_goal", to: "index_goal.js"
pin "new_item", to: "new_item.js"
pin "new_pfc", to: "new_pfc.js"
pin "new_pfc", to: "new_item_search.js"
pin "new_pfc", to: "pfc_item_search.js"
