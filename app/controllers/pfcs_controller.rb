class PfcsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :move_to_index, except: [:index, :show]
  
  def index
    @pfc = Pfc.all
    if session[:selected_goal_id].present?
      begin
        @goal = Goal.find(session[:selected_goal_id])
      rescue ActiveRecord::RecordNotFound
        session[:selected_goal_id] = nil
        flash[:alert] = "Selected goal not found. Please select a valid goal."
        redirect_to root_path
      end
    end
  end

  def new
    @pfc = Pfc.new
    @items = current_user.items
    if params[:keyword].present?
      @items = @items.where('item_name LIKE ?', "%#{params[:keyword]}%")
    end
  end

  def create
    Rails.logger.debug("PFC Params: #{pfc_params.inspect}")
    @pfc = Pfc.new(pfc_params)
    if @pfc.save
      redirect_to @pfc, notice: 'PFC was successfully created.'
    else
      @items = current_user.items
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

  def pfc_params
    params.require(:pfc).permit(:day, :timezone_id, :time, item_ids: []).merge(user_id: current_user.id)
  end

  def move_to_index
    unless user_signed_in?
      redirect_to root_path, alert: "ログインが必要です"
    end
  end

end
