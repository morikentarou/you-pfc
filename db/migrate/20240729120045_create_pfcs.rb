class CreatePfcs < ActiveRecord::Migration[7.0]
  def change
    create_table :pfcs do |t|

      t.timestamps
    end
  end
end
