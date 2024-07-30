class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items do |t|
      t.string     :item_name,         null: false
      t.integer    :item_kcal,         null: false
      t.integer    :item_oil,          null: false
      t.integer    :item_sugar,        null: false
      t.integer    :item_protein,      null: false
      t.integer    :store_id
      t.references :user,              null: false, foreign_key: true
      t.text       :remarks
      
      t.timestamps
    end
  end
end
