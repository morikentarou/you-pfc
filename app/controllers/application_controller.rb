class ApplicationController < ActionController::Base
  before_action :authenticate_user!, except: [:index, :show] 
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :birthday])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :birthday])
  end
end
