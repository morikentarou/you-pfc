class PfcsController < ApplicationController
  before_action :authenticate_user!
  before_action :move_to_index, except: [:index]
  
  def index
    @pfc = Pfc.all
    @goal = Goal.find(session[:selected_goal_id]) if session[:selected_goal_id].present?
  end

  def new
    @pfc = Pfc.new
  end

  def create
    @pfc = Pfc.new(item_params)
    if @pfc.save
      redirect_to root_path
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @pfc.update(pfc_params)
      redirect_to pfc_path(@pfc)
    else
      render :edit
    end
  end

  def destroy
    @pfc.destroy
    redirect_to root_path
  end


  private

  def item_params
    params.require(:pfc).permit(:,).merge(user_id: current_user.id)
  end
  
  def move_to_index
    unless user_signed_in?
      redirect_to action: :index
    end
  end

end
