class CreateItemsPfcs < ActiveRecord::Migration[7.0]
  def change
    create_table :pfcs_items do |t|

      t.references :pfc_id,           null: false, foreign_key: true
      t.references :item_id,          null: false, foreign_key: true

      t.timestamps
    end
  end
end
