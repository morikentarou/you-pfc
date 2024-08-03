require 'rails_helper'

RSpec.describe Item, type: :model do
  before do
    @item = FactoryBot.build(:item)
  end

  describe '食品の新規登録' do
    context '新規登録できるとき' do
      it 'すべての値が存在すれば登録できる' do
        expect(@item).to be_valid
      end
      it '入手場所を選択していなくても登録できる' do
        @item.store_id = nil
        expect(@item).to be_valid
      end
      it '詳細がなくても登録できる' do
        @item.remarks = nil
        expect(@item).to be_valid
      end
    end

    context '新規登録できないとき' do
      it '食品名が空では登録できない' do
        @item.item_name = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Item name can't be blank")
      end
      it '合計カロリーが空では登録できない' do
        @item.item_kcal = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Item kcal can't be blank")
      end
      it '脂質が空では登録できない' do
        @item.item_oil = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Item oil can't be blank")
      end
      it 'タンパク質が空では登録できない' do
        @item.item_protein = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Item protein can't be blank")
      end
      it '糖質が空では登録できない' do
        @item.item_sugar = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Item sugar can't be blank")
      end
      it 'ユーザーが紐づいていないと登録できない' do
        @item.user = nil
        @item.valid?
        expect(@item.errors.full_messages).to include('User must exist')
      end
    end
  end
end
