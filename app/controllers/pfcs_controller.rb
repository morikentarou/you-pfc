class PfcsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :move_to_index, except: [:index, :show]
  before_action :set_pfc, only: [:edit, :update, :destroy]
  
  def index
    @pfcs = current_user.pfcs.includes(:items)
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
    @pfc = Pfc.new(pfc_params)
    @pfc.user = current_user
    @items = current_user.items
    selected_item_ids = params[:pfc][:item_ids] || []
    adjustment_percentages = params[:pfc][:adjustment_percentages] || {}

    if selected_item_ids.blank?
      @pfc.errors.add(:item_ids, "を選択してください。")
      render :new
      return
    end

    selected_item_ids.each do |item_id|
      percentage = adjustment_percentages[item_id.to_s] || 100
    end

    if @pfc.save
      adjust_items
      redirect_to edit_pfc_path(@pfc)
    else
      render :new
    end
  end

  def show
  end

  def edit
    @pfc = Pfc.find(params[:id])
    @items = current_user.items
    if params[:keyword].present?
      @items = @items.where('item_name LIKE ?', "%#{params[:keyword]}%")
    end
  end

  def update
    @pfc = Pfc.find(params[:id])
    @pfc.user = current_user
    @items = current_user.items
    selected_item_ids = params[:pfc][:item_ids] || []
    adjustment_percentages = params[:pfc][:adjustment_percentages] || {}
  
    if selected_item_ids.blank?
      @pfc.errors.add(:item_ids, "を選択してください。")
      render :edit
      return
    end
  
    if @pfc.update(pfc_params)
      adjust_items
      redirect_to edit_pfc_path(@pfc)
    else
      render :edit
    end
  end

  def destroy
    if @pfc.destroy
      redirect_to pfcs_path, notice: 'PFCが削除されました。'
    else
      redirect_to pfcs_path, alert: 'PFCの削除に失敗しました。'
    end
  end


  private

  def pfc_params
    params.require(:pfc).permit(:day, :time, :timezone_id, item_ids: []).merge(user_id: current_user.id)
  end

  def move_to_index
    unless user_signed_in?
      redirect_to root_path, alert: "ログインが必要です"
    end
  end

  def adjust_items
    adjustment_percentages = (params[:pfc][:adjustment_percentages] || {}).transform_values(&:to_f)
    selected_item_ids = params[:pfc][:item_ids].map(&:to_i)
  
    selected_item_ids.each do |item_id|
      pfc_item = PfcItem.find_or_initialize_by(pfc: @pfc, item_id: item_id)
      item = Item.find(item_id)
      adjustment_percentage = adjustment_percentages[item_id.to_s] / 100.0
  
      pfc_item.update(
        adjusted_kcal: (item.item_kcal * adjustment_percentage).round,
        adjusted_protein: (item.item_protein * adjustment_percentage).round,
        adjusted_oil: (item.item_oil * adjustment_percentage).round,
        adjusted_sugar: (item.item_sugar * adjustment_percentage).round,
        adjustment_percentage: adjustment_percentage
      )
    end
  end

  def set_pfc
    @pfc = Pfc.find(params[:id])
  end

end
