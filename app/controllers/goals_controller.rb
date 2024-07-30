class GoalsController < ApplicationController

  before_action :authenticate_user!
  before_action :correct_user, only: [:edit, :update, :destroy]

  def index
    @goals = current_user.goals.order("created_at DESC")
    @goals = @goals.where('name LIKE ?', "%#{params[:keyword]}%") if params[:keyword].present?
    @goals = @goals.where(pfctype_id: params[:pfctype_id]) if params[:pfctype_id].present?
    Rails.logger.debug "Goals: #{@goals.inspect}"
  end

  def new
    @goal = Goal.new
  end

  def create
    @goal = Goal.new(goal_params)
    if @goal.save
      redirect_to goals_path
    else 
      render :new
    end
  end

  def destroy
    goal = Goal.find(params[:id])
    goal.destroy
    redirect_to goals_path
  end

  def edit
    @goal = Goal.find(params[:id])
  end

  def update
    goal = Goal.find(params[:id])
    goal.update(goal_params)
    redirect_to goals_path
  end

  def search
    @goals = current_user.goals.order("created_at DESC")
    @goals = @goals.where('name LIKE ?', "%#{params[:keyword]}%") if params[:keyword].present?
    @goals = @goals.where(pfctype_id: params[:pfctype_id]) if params[:pfctype_id].present?
    render :index
  end

  def select
    session[:selected_goal_id] = params[:id]
    redirect_to pfcs_path
  end

  private

  def goal_params
    params.require(:goal).permit(:goal_kcal, :goal_oil, :goal_protein, :goal_sugar, :pfctype_id).merge(user_id: current_user.id)
  end

  def correct_user
    @goal = Goal.find(params[:id])
    redirect_to(root_url) unless current_user == @goal.user
  end


end