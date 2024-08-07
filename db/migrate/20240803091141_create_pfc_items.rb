class CreatePfcItems < ActiveRecord::Migration[7.0]
  def change
    create_table :pfc_items do |t|
      t.references :item, null: false, foreign_key: { to_table: :items }, type: :bigint
      t.references :pfc, null: false, foreign_key: true, type: :bigint

      t.integer :adjusted_kcal
      t.integer :adjusted_protein
      t.integer :adjusted_oil
      t.integer :adjusted_sugar
      t.float   :adjustment_percentage
      
      t.timestamps
    end
  end
end
