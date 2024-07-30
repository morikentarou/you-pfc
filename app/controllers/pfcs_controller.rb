class PfcsController < ApplicationController
  before_action :move_to_index, except: [:index, :show]
  
  def index
    @pfc = Pfc.all
    @goal = Goal.find(session[:selected_goal_id]) if session[:selected_goal_id].present?
  end

  def new
    @pfc = Pfc.new
  end

  

  private
  
  def move_to_index
    unless user_signed_in?
      redirect_to action: :index
    end
  end

end
