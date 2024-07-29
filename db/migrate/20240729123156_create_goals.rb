class CreateGoals < ActiveRecord::Migration[7.0]
  def change
    create_table :goals do |t|
      t.integer    :goal_kcal,         null: false
      t.integer    :goal_oil,          null: false
      t.integer    :goal_sugar,        null: false
      t.integer    :goal_protein,      null: false
      t.references :user,              null: false, foreign_key: true
      t.integer    :pfctype_id 

      t.timestamps
    end
  end
end
