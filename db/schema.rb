# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_08_03_091141) do
  create_table "goals", charset: "utf8", force: :cascade do |t|
    t.integer "goal_kcal", null: false
    t.integer "goal_oil", null: false
    t.integer "goal_sugar", null: false
    t.integer "goal_protein", null: false
    t.bigint "user_id", null: false
    t.integer "pfctype_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_goals_on_user_id"
  end

  create_table "items", charset: "utf8", force: :cascade do |t|
    t.string "item_name", null: false
    t.integer "item_kcal", null: false
    t.integer "item_oil", null: false
    t.integer "item_sugar", null: false
    t.integer "item_protein", null: false
    t.integer "store_id"
    t.bigint "user_id", null: false
    t.text "remarks"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "pfc_items", charset: "utf8", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.bigint "pfc_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_pfc_items_on_item_id"
    t.index ["pfc_id"], name: "index_pfc_items_on_pfc_id"
  end

  create_table "pfcs", charset: "utf8", force: :cascade do |t|
    t.date "day", null: false
    t.datetime "time", null: false
    t.integer "timezone_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_pfcs_on_user_id"
  end

  create_table "users", charset: "utf8", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", null: false
    t.date "birthday", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "goals", "users"
  add_foreign_key "items", "users"
  add_foreign_key "pfc_items", "items"
  add_foreign_key "pfc_items", "pfcs"
  add_foreign_key "pfcs", "users"
end
