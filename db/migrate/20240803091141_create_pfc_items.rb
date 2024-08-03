class CreatePfcItems < ActiveRecord::Migration[7.0]
  def change
    create_table :pfc_items do |t|
      t.references :item, null: false, foreign_key: true
      t.references :pfc, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
