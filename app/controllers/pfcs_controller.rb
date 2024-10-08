class PfcsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :move_to_index, except: [:index, :show]
  before_action :set_pfc, only: [:edit, :update, :destroy]
  
  def index
    if current_user
      @pfcs = current_user.pfcs.includes(:items)
    else
      @pfcs = [] # ログインしていない場合は空の配列をセット
    end
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
    # 合計値を計算
    @total_kcal = @pfc.pfc_items.sum { |item| item.adjusted_kcal || item.item.item_kcal }
    @total_protein = @pfc.pfc_items.sum { |item| item.item.item_protein }
    @total_sugar = @pfc.pfc_items.sum { |item| item.item.item_sugar }
    @total_oil = @pfc.pfc_items.sum { |item| item.item.item_oil }
  end

  def update
    @pfc = Pfc.find(params[:id])
    @pfc.user = current_user
    selected_item_ids = params[:pfc][:item_ids] || []
    adjustment_percentages = params[:pfc][:adjustment_percentages] || {}

    if selected_item_ids.blank?
      @pfc.errors.add(:item_ids, "を選択してください。")
      render :edit
      return
    end

    # 既存の pfc_items を削除
    @pfc.pfc_items.destroy_all
    
    # 新しい pfc_items を作成
    selected_item_ids.each do |item_id|
      percentage = adjustment_percentages[item_id] || 100
      @pfc.pfc_items.create(item_id: item_id, adjusted_kcal: calculate_adjusted_kcal(item_id, percentage))
    end

    if @pfc.save
      redirect_to edit_pfc_path(@pfc), notice: 'Pfc was successfully updated.'
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

  def calculate_adjusted_kcal(item_id, percentage)
    item = Item.find(item_id)
    item.item_kcal * (percentage.to_f / 100.0)
  end

end
