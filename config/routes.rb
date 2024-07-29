Rails.application.routes.draw do
  devise_for :users
  root 'pfcs#index'
  resources :pfcs
  resources :goals, only: [:index, :new, :create, :destroy, :edit, :update] do
    collection do
      get 'search'
    end
    member do
      get 'select'
    end
  end
end

