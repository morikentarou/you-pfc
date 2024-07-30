class CreatePfcsItems < ActiveRecord::Migration[7.0]
  def change
    create_table :pfcs_items do |t|

      t.timestamps
    end
  end
end
