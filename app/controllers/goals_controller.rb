

private

def goal_params
  params.require(:goal).permit(:goal_kcal, :goal_oil, :goal_protein, :goal_sugar, :pfctype_id).merge(user_id: current_user.id)
end

def correct_user
  @goal = Goal.find(params[:id])
  redirect_to(root_url) unless current_user == @goal.user
end

end

