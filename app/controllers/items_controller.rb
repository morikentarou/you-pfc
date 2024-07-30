class ItemsController < ApplicationController
  before_action :authenticate_user!

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

  private

  def item_params
    params.require(:item).permit(:item_kcal, :item_oil, :item_protein, :item_sugar, :item_name, :store_id, :remarks).merge(user_id: current_user.id)
  end

end
