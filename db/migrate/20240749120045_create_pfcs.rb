class CreatePfcs < ActiveRecord::Migration[7.0]
  def change
    create_table :pfcs do |t|
      t.date       :day,         null: false
      t.datetime   :time,        null: false
      t.integer    :timezone_id, null: false
      t.references :user,        null: false, foreign_key: true

      t.timestamps
    end
  end
end
