class ApplicationController < ActionController::Base
  before_action :basic_auth, only: [:index, :show]
  before_action :authenticate_user!, except: [:index, :show] 
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :birthday])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :birthday])
  end

  def basic_auth
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV["BASIC_AUTH_USER"] && password == ENV["BASIC_AUTH_PASSWORD"]
    end
  end

end
