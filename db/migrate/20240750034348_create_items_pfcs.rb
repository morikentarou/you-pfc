class CreateItemsPfcs < ActiveRecord::Migration[7.0]
  def change
    create_table :items_pfcs do |t|

      t.references :item, null: false, foreign_key: true
      t.references :pfc, null: false, foreign_key: true

      t.timestamps
    end
  end
end
