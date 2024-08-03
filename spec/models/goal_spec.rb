require 'rails_helper'

RSpec.describe Goal, type: :model do
  before do
    @goal = FactoryBot.build(:goal)
  end

  describe '目標新規登録' do
    context '新規登録できるとき' do
      it 'すべての値が存在すれば登録できる' do
        expect(@goal).to be_valid
      end
      it 'カテゴリーを選択していなくても登録できる' do
        @goal.pfctype_id = nil
        expect(@goal).to be_valid
      end
    end

    context '新規登録できないとき' do
      it '合計カロリーが空では登録できない' do
        @goal.goal_kcal = nil
        @goal.valid?
        expect(@goal.errors.full_messages).to include("Goal kcal can't be blank")
      end
      it '脂質が空では登録できない' do
        @goal.goal_oil = nil
        @goal.valid?
        expect(@goal.errors.full_messages).to include("Goal oil can't be blank")
      end
      it 'タンパク質が空では登録できない' do
        @goal.goal_protein = nil
        @goal.valid?
        expect(@goal.errors.full_messages).to include("Goal protein can't be blank")
      end
      it '糖質が空では登録できない' do
        @goal.goal_sugar = nil
        @goal.valid?
        expect(@goal.errors.full_messages).to include("Goal sugar can't be blank")
      end
      it 'ユーザーが紐づいていないと登録できない' do
        @goal.user = nil
        @goal.valid?
        expect(@goal.errors.full_messages).to include('User must exist')
      end
    end
  end
end
