Rails.application.routes.draw do
  devise_for :users

  root 'pfcs#index'

  resources :pfcs

  resources :goals do
    collection do
      get 'search'
    end
    member do
      get 'select'
    end
  end

  resources :items do
    collection do
      get 'search'
    end
  end
  
end

