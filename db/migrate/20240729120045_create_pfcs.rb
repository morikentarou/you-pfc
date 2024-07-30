class CreatePfcs < ActiveRecord::Migration[7.0]
  def change
    create_table :pfcs do |t|
      t.references :user,        null: false, foreign_key: true
      t.references :item,        null: false, foreign_key: true
      t.dat :day
      t.dat :time

      t.timestamps
    end
  end
end
