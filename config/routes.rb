Rails.application.routes.draw do
  devise_for :users
  root 'pfcs#index'
  resources :pfcs
end

