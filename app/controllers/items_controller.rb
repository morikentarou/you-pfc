class ItemsController < ApplicationController
  before_action :authenticate_user!

  def index 
    if current_user.present?
      @items = current_user.items.order("created_at DESC")
      @items = @items.where('name LIKE ?', "%#{params[:keyword]}%") if params[:keyword].present?
      @items = @items.where(store_id: params[:store_id]) if params[:store_id].present?
    else
      @items = []
    end
  end

  def new
    @item = Item.new
  end

  def create
    @item = Item.new(item_params)
    if @item.save
      redirect_to items_path
    else 
      render :new
    end
  end

  def show
  end

  def destroy
    item = Item.find(params[:id])
    goal.destroy
    redirect_to items_path
  end

  def edit
    @item = Item.find(params[:id])
  end

  def update
    item = Item.find(params[:id])
    goal.update(item_params)
    redirect_to items_path
  end

  def search
    @items = current_user.items
    if params[:keyword].present?
      @items = @items.where('item_name LIKE ?', "%#{params[:keyword]}%")
    end

    if request.xhr?
      render partial: 'search_results', locals: { items: @items }
    else
      @items = Item.all
    end
  end

  private

  def item_params
    params.require(:item).permit(:item_kcal, :item_oil, :item_protein, :item_sugar, :item_name, :store_id, :remarks).merge(user_id: current_user.id)
  end

  def filtered_items(scope)
    items = scope.order("created_at DESC")
    items = items.where('item_name LIKE ?', "%#{params[:keyword]}%") if params[:keyword].present?
    items = items.where(store_id: params[:store_id]) if params[:store_id].present?
    items
  end
  
end
